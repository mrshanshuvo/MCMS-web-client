import React from "react";

/**
 * A standardized Loader component using DaisyUI.
 *
 * @param {Object} props
 * @param {boolean} [props.fullHeight=true] - Whether to use full viewport height (h-screen) or relative container height (h-full).
 * @param {'xs' | 'sm' | 'md' | 'lg' | 'xl'} [props.size='xl'] - The size of the loader.
 * @param {'infinity' | 'spinner' | 'dots' | 'ring' | 'ball' | 'bars'} [props.variant='infinity'] - The DaisyUI loader variant.
 * @param {string} [props.message] - Optional message to display below the loader.
 * @param {boolean} [props.inline=false] - Whether to render as an inline element (no wrapper div with height).
 * @param {string} [props.className=''] - Additional CSS classes for the container/loader.
 */
const Loader = ({
  fullHeight = true,
  size = "xl",
  variant = "infinity",
  message = "",
  inline = false,
  className = "",
}) => {
  const loaderClasses = `loading loading-${variant} loading-${size} text-inherit ${
    !inline ? "text-[#495E57]" : ""
  } ${className}`;

  if (inline) {
    return (
      <>
        <span className={loaderClasses}></span>
        {message && <span className="ml-2">{message}</span>}
      </>
    );
  }

  const containerClasses = `flex flex-col justify-center items-center ${
    fullHeight ? "min-h-screen" : "min-h-96"
  } ${className}`;

  return (
    <div className={containerClasses}>
      <span className={loaderClasses}></span>
      {message && (
        <p className="mt-4 text-[#45474B]/70 font-medium">{message}</p>
      )}
    </div>
  );
};

export default Loader;
