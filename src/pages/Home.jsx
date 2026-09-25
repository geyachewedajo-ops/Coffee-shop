import { Link } from "react-router-dom";

function Home() {
  return (
    <section className="hero">

      <div className="hero-content">

        <p className="small-title">
          WELCOME TO WEDAJO COFFEE
        </p>

        <h1>
          Fresh Coffee.

          <br />
          Good Moments.
        </h1>

        <p>
          Enjoy freshly prepared Ethiopian coffee,
          delicious snacks, and a comfortable place
          to relax.
        </p>

        <div className="hero-buttons">

          <Link
            to="/menu"
            className="primary-btn"
          >
            View Menu
          </Link>

          <Link
            to="/contact"
            className="secondary-btn"
          >
            Visit Us
          </Link>

        </div>

      </div>

      <div className="hero-icon">
        ☕
      </div>

    </section>
  );
}

export default Home;
