import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg
            {...props}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Outer Concentric Boundary Rings */}
            <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="1.8" className="opacity-90" />
            <circle cx="50" cy="50" r="41" stroke="currentColor" strokeWidth="1" className="opacity-60" />
            <circle cx="50" cy="50" r="32" stroke="currentColor" strokeWidth="1" className="opacity-50" />
            <circle cx="50" cy="50" r="23" stroke="currentColor" strokeWidth="1" className="opacity-60" />

            {/* Rosette Overlapping Circular Arcs (12-fold geometric symmetry from INOVA-HUB logo) */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
                <g key={angle} transform={`rotate(${angle} 50 50)`}>
                    <circle
                        cx="50"
                        cy="30"
                        r="25"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        fill="none"
                        className="opacity-80"
                    />
                </g>
            ))}

            {/* Inner Ring Accent */}
            <circle cx="50" cy="50" r="16" stroke="currentColor" strokeWidth="1.5" className="opacity-90" />

            {/* Solid Center Hub Disc */}
            <circle cx="50" cy="50" r="11" fill="currentColor" />
        </svg>
    );
}
