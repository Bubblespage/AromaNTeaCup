export default function Hero() {
  const scrollToMenu = () => {
    document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero">
      <div className="hero-image">
        <div className="hero-content">
          <h1>Awaken Your Senses</h1>
          <p className="hero-subtitle">Experience the finest blends, hand-crafted to perfection.</p>
          <button className="order-btn" onClick={scrollToMenu}>Order Now</button>
        </div>
      </div>
    </section>
  );
}
