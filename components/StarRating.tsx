import { FaStar } from "react-icons/fa6";

type Props = {
    rating: number;
};

export default function StarRating({ rating }: Props) {
    const stars = Array.from({ length: 5 }, (_, index) => {
        // Ratings 0-5: yellow stars
        if (rating <= 5) {
            const value = rating - index;

            if (value >= 1) {
                return "yellow";
            }

            if (value === 0.5) {
                return "half-yellow";
            }

            return "empty";
        }

        // Ratings 5-10: yellow base with purple replacing
        // the stars from left to right
        const purpleValue = rating - 5 - index;

        if (purpleValue >= 1) {
            return "purple";
        }

        if (purpleValue === 0.5) {
            return "half-purple";
        }

        return "yellow";
    });

    return (
        <div className="flex items-center gap-0.5 text-lg">
            {stars.map((star, index) => {
                if (star === "yellow") {
                    return (
                        <FaStar
                            key={index}
                            className="text-yellow-400"
                        />
                    );
                }

                if (star === "purple") {
                    return (
                        <FaStar
                            key={index}
                            className="text-purple-500"
                        />
                    );
                }

                if (star === "empty") {
                    return (
                        <FaStar
                            key={index}
                            className="text-neutral-300 dark:text-neutral-700"
                        />
                    );
                }

                if (star === "half-yellow") {
                    return (
                        <span
                            key={index}
                            className="relative inline-block"
                        >
                            {/* Empty base */}
                            <FaStar className="text-neutral-300 dark:text-neutral-700" />

                            {/* Yellow left half */}
                            <span className="absolute inset-y-0 left-0 w-1/2 overflow-hidden">
                                <FaStar className="text-yellow-400" />
                            </span>
                        </span>
                    );
                }

                // half-purple
                return (
                    <span
                        key={index}
                        className="relative inline-block"
                    >
                        {/* Yellow base */}
                        <FaStar className="text-yellow-400" />

                        {/* Purple left half */}
                        <span className="absolute inset-y-0 left-0 w-1/2 overflow-hidden">
                            <FaStar className="text-purple-500" />
                        </span>
                    </span>
                );
            })}
        </div>
    );
}









