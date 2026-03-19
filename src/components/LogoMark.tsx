export function LogoMark() {
  return (
    <span aria-hidden="true" className="inline-flex items-center justify-center">
      <svg
        width="28"
        height="28"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="50" cy="50" r="42" stroke="#7C6CF6" strokeWidth="2" />
        <ellipse
          cx="50"
          cy="50"
          rx="42"
          ry="14"
          stroke="#7C6CF6"
          strokeWidth="1.2"
          opacity="0.5"
        />
        <ellipse
          cx="50"
          cy="50"
          rx="14"
          ry="42"
          stroke="#7C6CF6"
          strokeWidth="1.2"
          opacity="0.3"
        />
        <circle cx="50" cy="50" r="5.5" fill="#7C6CF6" />
        <circle cx="50" cy="8" r="3" fill="#7C6CF6" opacity="0.7" />
      </svg>
    </span>
  );
}

