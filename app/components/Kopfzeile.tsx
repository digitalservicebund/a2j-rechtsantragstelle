//https://kern-ux-plain-kern-ux-783aa9be89f1fecf3bdc3d2f5004d885b31ec77d9.usercontent.opencode.de/?path=/docs/komponenten-kopfzeile--docs
export default function Kopfzeile() {
  return (
    <div className="kern-kopfzeile">
      <div className="container-fluid">
        <div className="kern-kopfzeile__content">
          <span className="kern-kopfzeile__flagge" aria-hidden="true">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 16"
            >
              <path fill="#000" d="M0 .5h24v5.333H0z" />
              <path fill="red" d="M0 5.833h24v5.333H0z" />
              <path fill="#FACA2C" d="M0 11.167h24V16.5H0z" />
            </svg>
          </span>
          <span className="kern-kopfzeile__label">
            Eine offizielle Website der Bundesrepublik Deutschland
          </span>
        </div>
      </div>
    </div>
  );
}
