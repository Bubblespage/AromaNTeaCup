import { Home, Coffee, User, PhoneCall, Info } from 'lucide-react';

export default function BottomNav({ onHome, onMenu, onProfile, onContact, onAbout }) {
  return (
    <nav className="bottom-nav glass">
      <button className="nav-item" onClick={onHome}>
        <Home size={24} />
        <span>Home</span>
      </button>
      <button className="nav-item" onClick={onMenu}>
        <Coffee size={24} />
        <span>Menu</span>
      </button>
      <button className="nav-item" onClick={onProfile}>
        <User size={24} />
        <span>Profile</span>
      </button>
      <button className="nav-item" onClick={onContact}>
        <PhoneCall size={24} />
        <span>Contact</span>
      </button>
      <button className="nav-item" onClick={onAbout}>
        <Info size={24} />
        <span>About</span>
      </button>
    </nav>
  );
}
