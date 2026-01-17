import { Link } from "react-router-dom";
import "../assets/App.css";

export default function AdminPage() {
  return (
    <div className="admin-page">
      <div className="admin-container">
        <h1>Admin Dashboard</h1>
        <p>Navigation Hub - Access all pages</p>

        <div className="admin-links-grid">
          {/* Main Pages */}
          <section className="admin-section">
            <h2>Main Pages</h2>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/landingPage">Landing Page</Link>
              </li>
              <li>
                <Link to="/calendar">Events Calendar</Link>
              </li>
              <li>
                <Link to="/events/search">Events Search</Link>
              </li>
              <li>
                <Link to="/tags">Tags Page</Link>
              </li>
            </ul>
          </section>

          {/* Authentication Pages */}
          <section className="admin-section">
            <h2>Authentication</h2>
            <ul>
              <li>
                <Link to="/Login">Login</Link>
              </li>
              <li>
                <Link to="/VolunteerSignUp">Volunteer Sign Up</Link>
              </li>
              <li>
                <Link to="/OrganizerSignUp">Organizer Sign Up</Link>
              </li>
              <li>
                <Link to="/forgot-password">Forgot Password</Link>
              </li>
              <li>
                <Link to="/reset-password">Reset Password</Link>
              </li>
            </ul>
          </section>

          {/* User Management */}
          <section className="admin-section">
            <h2>User Management</h2>
            <ul>
              <li>
                <Link to="/Profile">Profile Page</Link>
              </li>
              <li>
                <Link to="/userInput">User Input Page</Link>
              </li>
            </ul>
          </section>

          {/* Event Management */}
          <section className="admin-section">
            <h2>Event Management</h2>
            <ul>
              <li>
                <Link to="/MyEventsOrganizer">My Events (Organizer)</Link>
              </li>
              <li>
                <Link to="/MyEventsVolunteer">My Events (Volunteer)</Link>
              </li>
              <li>
                <Link to="/modifyEvent">Modify Event</Link>
              </li>
            </ul>
          </section>

          {/* Development & Testing */}
          <section className="admin-section">
            <h2>Development & Testing</h2>
            <ul>
              <li>
                <Link to="/exampleMongoHookup">Example Mongo Hookup</Link>
              </li>
            </ul>
          </section>
        </div>
      </div>

      <style jsx>{`
        .admin-page {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .admin-container {
          background-color: #f5f5f5;
          border-radius: 8px;
          padding: 30px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .admin-container h1 {
          text-align: center;
          color: #333;
          margin-bottom: 10px;
          font-size: 2.5em;
        }

        .admin-container > p {
          text-align: center;
          color: #666;
          margin-bottom: 40px;
          font-size: 1.1em;
        }

        .admin-links-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
        }

        .admin-section {
          background-color: white;
          padding: 20px;
          border-radius: 6px;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
        }

        .admin-section h2 {
          color: #0066cc;
          margin-top: 0;
          margin-bottom: 15px;
          font-size: 1.3em;
          border-bottom: 2px solid #0066cc;
          padding-bottom: 10px;
        }

        .admin-section ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .admin-section li {
          margin-bottom: 12px;
        }

        .admin-section a {
          display: inline-block;
          padding: 10px 15px;
          background-color: #0066cc;
          color: white;
          text-decoration: none;
          border-radius: 4px;
          transition: all 0.3s ease;
          font-weight: 500;
          width: 100%;
          text-align: left;
          box-sizing: border-box;
        }

        .admin-section a:hover {
          background-color: #0052a3;
          transform: translateX(5px);
          box-shadow: 0 2px 6px rgba(0, 102, 204, 0.3);
        }

        .admin-section a:active {
          transform: translateX(2px);
        }

        @media (max-width: 768px) {
          .admin-container {
            padding: 20px;
          }

          .admin-container h1 {
            font-size: 2em;
          }

          .admin-links-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
