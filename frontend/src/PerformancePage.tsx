

import { useEffect, useState } from "react";

import api from "./api";

type Goal = {

  id: number;

  employeeId: number;

  title: string;

  description: string;

  startDate: string;

  targetDate: string;

  progress: number;

  status: string;

};

type Review = {

  id: number;

  employeeId: number;

  reviewerUsername: string;

  rating: number;

  feedback: string;

  reviewPeriod: string;

  reviewDate: string;

  status: string;

};

type Feedback = {

  id: number;

  employeeId: number;

  reviewerUsername: string;

  category: string;

  rating: number;

  feedback: string;

};

type GoalProgressRowProps = {

  item: Goal;

  onSave: (progress: number) => Promise<void>;

};

function GoalProgressRow({ item, onSave }: GoalProgressRowProps) {

  const [progress, setProgress] = useState(item.progress);

  const [saving, setSaving] = useState(false);

  useEffect(() => {

    setProgress(item.progress);

  }, [item.progress]);

  const handleSave = async () => {

    if (

      !Number.isFinite(progress) ||

      progress < 0 ||

      progress > 100

    ) {

      return;

    }

    setSaving(true);

    try {

      await onSave(progress);

    } finally {

      setSaving(false);

    }

  };

  return (

    <tr>

      <td>{item.title}</td>

      <td>{item.startDate}</td>

      <td>{item.targetDate}</td>

      <td>

        <div className="goal-progress-control">

          <input

            type="number"

            min="0"

            max="100"

            value={progress}

            onChange={(e) => setProgress(Number(e.target.value))}

            aria-label={`Progress for ${item.title}`}

          />

          <button

            type="button"

            className="primary"

            disabled={saving || progress < 0 || progress > 100}

            onClick={handleSave}

          >

            {saving ? "Saving..." : "Save"}

          </button>

        </div>

      </td>

      <td>{item.status}</td>

    </tr>

  );

}

function PerformancePage() {

  const [employeeId, setEmployeeId] = useState("");

  const [goals, setGoals] = useState<Goal[]>([]);

  const [reviews, setReviews] = useState<Review[]>([]);

  const [feedback, setFeedback] = useState<Feedback[]>([]);

  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  const [feedbackForm, setFeedbackForm] = useState({

    reviewerUsername: "",

    category: "",

    rating: 5,

    feedback: ""

  });

  const [goal, setGoal] = useState({

    title: "",

    description: "",

    startDate: "",

    targetDate: ""

  });

  const [review, setReview] = useState({

    reviewerUsername: "",

    rating: 5,

    feedback: "",

    reviewPeriod: ""

  });

  const loadPerformance = async () => {

    if (!employeeId) {

      setGoals([]);

      setReviews([]);

      setFeedback([]);

      return;

    }

    setLoading(true);

    setErrorMessage("");

    try {

      const [

        goalResponse,

        reviewResponse,

        feedbackResponse

      ] = await Promise.all([

        api.get(`/performance/goals/employee/${employeeId}`),

        api.get(`/performance/reviews/employee/${employeeId}`),

        api.get(`/performance/feedback/employee/${employeeId}`)

      ]);

      setGoals(goalResponse.data);

      setReviews(reviewResponse.data);

      setFeedback(feedbackResponse.data);

    } catch (error) {

      console.error("Failed to load performance data:", error);

      setErrorMessage(

        "Unable to load performance data. Please try again."

      );

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    loadPerformance();

  }, [employeeId]);

  const createGoal = async () => {

    if (

      !employeeId ||

      !goal.title.trim() ||

      !goal.description.trim() ||

      !goal.startDate ||

      !goal.targetDate

    ) {

      setErrorMessage("Please complete all goal fields.");

      setSuccessMessage("");

      return;

    }

    if (goal.targetDate < goal.startDate) {

      setErrorMessage(

        "Target date must be on or after the start date."

      );

      setSuccessMessage("");

      return;

    }

    try {

      setErrorMessage("");

      setSuccessMessage("");

      await api.post("/performance/goals", {

        employeeId: Number(employeeId),

        ...goal,

        progress: 0,

        status: "IN_PROGRESS"

      });

      setGoal({

        title: "",

        description: "",

        startDate: "",

        targetDate: ""

      });

      setSuccessMessage(

        "Performance goal created successfully."

      );

      await loadPerformance();

    } catch (error) {

      console.error("Failed to create goal:", error);

      setErrorMessage(

        "Failed to create the goal. Please try again."

      );

    }

  };

  const createReview = async () => {

    if (

      !employeeId ||

      !review.reviewerUsername.trim() ||

      !review.reviewPeriod.trim() ||

      !review.feedback.trim() ||

      review.rating < 1 ||

      review.rating > 5

    ) {

      setErrorMessage(

        "Complete all review fields and enter a rating from 1 to 5."

      );

      setSuccessMessage("");

      return;

    }

    try {

      setErrorMessage("");

      setSuccessMessage("");

      await api.post("/performance/reviews", {

        employeeId: Number(employeeId),

        ...review,

        reviewDate: new Date().toISOString().split("T")[0],

        status: "SUBMITTED"

      });

      setReview({

        reviewerUsername: "",

        rating: 5,

        feedback: "",

        reviewPeriod: ""

      });

      setSuccessMessage(

        "Performance review submitted successfully."

      );

      await loadPerformance();

    } catch (error) {

      console.error("Failed to submit review:", error);

      setErrorMessage(

        "Failed to submit the review. Please try again."

      );

    }

  };

  const submitFeedback = async () => {

    if (

      !employeeId ||

      !feedbackForm.reviewerUsername.trim() ||

      !feedbackForm.category.trim() ||

      !feedbackForm.feedback.trim() ||

      feedbackForm.rating < 1 ||

      feedbackForm.rating > 5

    ) {

      setErrorMessage(

        "Complete all feedback fields and enter a rating from 1 to 5."

      );

      setSuccessMessage("");

      return;

    }

    try {

      setErrorMessage("");

      setSuccessMessage("");

      await api.post("/performance/feedback", {

        employeeId: Number(employeeId),

        ...feedbackForm

      });

      setFeedbackForm({

        reviewerUsername: "",

        category: "",

        rating: 5,

        feedback: ""

      });

      setSuccessMessage(

        "360° feedback submitted successfully."

      );

      await loadPerformance();

    } catch (error) {

      console.error("Failed to submit feedback:", error);

      setErrorMessage(

        "Failed to submit feedback. Please try again."

      );

    }

  };

  const updateGoalProgress = async (

    goalId: number,

    progress: number

  ) => {

    setErrorMessage("");

    setSuccessMessage("");

    try {

      await api.put(

        `/performance/goals/${goalId}/progress?progress=${progress}`

      );

      setSuccessMessage(

        "Goal progress updated successfully."

      );

      await loadPerformance();

    } catch (error) {

      console.error("Failed to update goal progress:", error);

      setErrorMessage(

        "Failed to update goal progress. Please try again."

      );

      throw error;

    }

  };

  const averageRating =

    reviews.length === 0

      ? 0

      : reviews.reduce((sum, item) => sum + item.rating, 0) /

        reviews.length;

  return (

    <div>

      {loading && (

        <p role="status">Loading performance data...</p>

      )}

      {errorMessage && (

        <p role="alert" className="error-message">

          {errorMessage}

        </p>

      )}

      {successMessage && (

        <p role="status" className="success-message">

          {successMessage}

        </p>

      )}

      <section className="panel">

        <h2>Performance Management</h2>

        <label>

          Employee ID

          <input

            type="number"

            min="1"

            placeholder="Enter employee ID"

            value={employeeId}

            onChange={(e) => setEmployeeId(e.target.value)}

          />

        </label>

      </section>

      {employeeId && (

        <>

          <section className="panel">

            <h2>Performance Scorecard</h2>

            <p>Total Goals: {goals.length}</p>

            <p>Total Reviews: {reviews.length}</p>

            <p>

              Average Rating:{" "}

              {averageRating

                ? averageRating.toFixed(1)

                : "N/A"}{" "}

              / 5

            </p>

          </section>

          <section className="panel">

            <h2>Set Performance Goal</h2>

            <div className="form-grid">

              <input

                placeholder="Goal Title"

                aria-label="Goal title"

                value={goal.title}

                onChange={(e) =>

                  setGoal({

                    ...goal,

                    title: e.target.value

                  })

                }

              />

              <input

                placeholder="Description"

                aria-label="Goal description"

                value={goal.description}

                onChange={(e) =>

                  setGoal({

                    ...goal,

                    description: e.target.value

                  })

                }

              />

              <input

                type="date"

                aria-label="Goal start date"

                value={goal.startDate}

                onChange={(e) =>

                  setGoal({

                    ...goal,

                    startDate: e.target.value

                  })

                }

              />

              <input

                type="date"

                aria-label="Goal target date"

                value={goal.targetDate}

                onChange={(e) =>

                  setGoal({

                    ...goal,

                    targetDate: e.target.value

                  })

                }

              />

            </div>

            <button

              type="button"

              className="primary add-button"

              onClick={createGoal}

            >

              Add Goal

            </button>

          </section>

          <section className="panel">

            <h2>Performance Review</h2>

            <div className="form-grid">

              <input

                placeholder="Reviewer Username"

                aria-label="Reviewer username"

                value={review.reviewerUsername}

                onChange={(e) =>

                  setReview({

                    ...review,

                    reviewerUsername: e.target.value

                  })

                }

              />

              <input

                type="number"

                min="1"

                max="5"

                aria-label="Review rating"

                value={review.rating}

                onChange={(e) =>

                  setReview({

                    ...review,

                    rating: Number(e.target.value)

                  })

                }

              />

              <input

                placeholder="Review Period (e.g. 2026-Q4)"

                aria-label="Review period"

                value={review.reviewPeriod}

                onChange={(e) =>

                  setReview({

                    ...review,

                    reviewPeriod: e.target.value

                  })

                }

              />

              <input

                placeholder="Feedback"

                aria-label="Review feedback"

                value={review.feedback}

                onChange={(e) =>

                  setReview({

                    ...review,

                    feedback: e.target.value

                  })

                }

              />

            </div>

            <button

              type="button"

              className="primary add-button"

              onClick={createReview}

            >

              Submit Review

            </button>

          </section>

          <section className="panel">

            <h2>Goals</h2>

            <div className="table-responsive">
              <table className="performance-table goals-table">

              <thead>

                <tr>

                  <th>Goal</th>

                  <th>Start</th>

                  <th>Target</th>

                  <th>Progress</th>

                  <th>Status</th>

                </tr>

              </thead>

              <tbody>

                {goals.map((item) => (

                  <GoalProgressRow

                    key={item.id}

                    item={item}

                    onSave={(progress) =>

                      updateGoalProgress(item.id, progress)

                    }

                  />

                ))}

              </tbody>

              </table>
            </div>

          </section>

          <section className="panel">

            <h2>360° Feedback</h2>

            <div className="form-grid">

              <input

                placeholder="Reviewer Username"

                aria-label="Feedback reviewer username"

                value={feedbackForm.reviewerUsername}

                onChange={(e) =>

                  setFeedbackForm({

                    ...feedbackForm,

                    reviewerUsername: e.target.value

                  })

                }

              />

              <input

                placeholder="Category (e.g. Teamwork)"

                aria-label="Feedback category"

                value={feedbackForm.category}

                onChange={(e) =>

                  setFeedbackForm({

                    ...feedbackForm,

                    category: e.target.value

                  })

                }

              />

              <select

                aria-label="Feedback rating"

                value={feedbackForm.rating}

                onChange={(e) =>

                  setFeedbackForm({

                    ...feedbackForm,

                    rating: Number(e.target.value)

                  })

                }

              >

                {[1, 2, 3, 4, 5].map((rating) => (

                  <option key={rating} value={rating}>

                    {rating} / 5

                  </option>

                ))}

              </select>

              <input

                placeholder="Feedback comments"

                aria-label="Feedback comments"

                value={feedbackForm.feedback}

                onChange={(e) =>

                  setFeedbackForm({

                    ...feedbackForm,

                    feedback: e.target.value

                  })

                }

              />

            </div>

            <button

              type="button"

              className="primary add-button"

              onClick={submitFeedback}

            >

              Submit Feedback

            </button>

            <div className="table-responsive">
              <table className="performance-table">

              <thead>

                <tr>

                  <th>Reviewer</th>

                  <th>Category</th>

                  <th>Rating</th>

                  <th>Feedback</th>

                </tr>

              </thead>

              <tbody>

                {feedback.map((item) => (

                  <tr key={item.id}>

                    <td>{item.reviewerUsername}</td>

                    <td>{item.category}</td>

                    <td>{item.rating}/5</td>

                    <td>{item.feedback}</td>

                  </tr>

                ))}

                {feedback.length === 0 && (

                  <tr>

                    <td colSpan={4}>

                      No feedback submitted yet.

                    </td>

                  </tr>

                )}

              </tbody>

              </table>
            </div>

          </section>

          <section className="panel">

            <h2>Reviews</h2>

            <div className="table-responsive">
              <table className="performance-table">

              <thead>

                <tr>

                  <th>Reviewer</th>

                  <th>Rating</th>

                  <th>Period</th>

                  <th>Feedback</th>

                  <th>Date</th>

                </tr>

              </thead>

              <tbody>

                {reviews.map((item) => (

                  <tr key={item.id}>

                    <td>{item.reviewerUsername}</td>

                    <td>{item.rating}/5</td>

                    <td>{item.reviewPeriod}</td>

                    <td>{item.feedback}</td>

                    <td>{item.reviewDate}</td>

                  </tr>

                ))}

                {reviews.length === 0 && (

                  <tr>

                    <td colSpan={5}>

                      No performance reviews found.

                    </td>

                  </tr>

                )}

              </tbody>

              </table>
            </div>

          </section>

        </>

      )}

    </div>

  );

}

export default PerformancePage;