const Background = () => {
  const waves = [
    {
      opacity: 0.3,
      dur: "10s",
      values: "270 230; -334 180; 270 230",
      keyTimes: "0; .5; 1",
    },
    {
      opacity: 0.6,
      dur: "8s",
      values: "-270 230;243 220;-270 230",
      keyTimes: "0; .6; 1",
    },
    {
      opacity: 0.9,
      dur: "10s",
      values: "0 230;-140 200;0 230",
      keyTimes: "0; .4; 1",
    },
  ];

  return (
    <svg
      className="absolute inset-0 w-full h-full block"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMax slice"
    >
      <defs>
        <linearGradient id="bg">
          <stop offset="0%" stopColor="#878787" />
          <stop offset="50%" stopColor="#bab8b8" />
          <stop offset="100%" stopColor="#878787" />
        </linearGradient>

        <path
          id="wave"
          fill="url(#bg)"
          d="M-363.852,502.589c0,0,236.988-41.997,505.475,0 
             s371.981,38.998,575.971,0
             s293.985-39.278,505.474,5.859
             s493.475,48.368,716.963-4.995v560.106H-363.852V502.589z"
        />
      </defs>

      <g>
        {waves.map((w, i) => (
          <use key={i} href="#wave" opacity={w.opacity}>
            <animateTransform
              attributeName="transform"
              type="translate"
              dur={w.dur}
              values={w.values}
              keyTimes={w.keyTimes}
              calcMode="spline"
              keySplines="0.42,0,0.58,1.0;0.42,0,0.58,1.0"
              repeatCount="indefinite"
            />
          </use>
        ))}
      </g>
    </svg>
  );
};

export default Background;
