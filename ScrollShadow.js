import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import "./ScrollShadow.css";

/**
 * Drops a shadow to indicate scrolling area
 *
 * @param {object} props
 * @param {ReactElement} props.children The scrollable component
 * @param {string} props.color The color of the shadow
 */
const ScrollShadow = ({ children, color, height, className }) => {
  const scrollArea = useRef();
  const [scrollClass, setScrollClass] = useState("");

  /**
   * Detects in which vertical direction the user can scroll.
   *
   * @param {HTMLEventElement} event
   */
  const onScroll = (event) => {
    const { scrollHeight, offsetHeight, scrollTop } = event.target;
    if (scrollHeight === offsetHeight && scrollTop === 0) {
      setScrollClass("");
    } else if (scrollHeight - scrollTop === offsetHeight) {
      setScrollClass("canScrollUp");
    } else if (scrollTop === 0) {
      setScrollClass("canScrollDown");
    } else if (scrollHeight - scrollTop > 0) {
      setScrollClass("canScrollDown canScrollUp");
    } else {
      setScrollClass("");
    }
  };

  useEffect(() => {
    const onMutationsHandler = () => {
      if (scrollArea && scrollArea.current) {
        onScroll({ target: scrollArea.current });
      }
    };

    const observer = new MutationObserver(onMutationsHandler);

    if (scrollArea && scrollArea.current) {
      scrollArea.current.addEventListener("scroll", onScroll);
      observer.observe(scrollArea.current, {
        attributes: true,
        subtree: true,
        childList: true,
      });
    }

    return () => {
      if (scrollArea && scrollArea.current) {
        scrollArea.current.removeEventListener("scroll", onScroll);
        observer.disconnect();
      }
    };
  }, []);

  const scrollNavStyles = {
    backgroundColor: color,
    boxShadow: `0 0 10px 10px ${color}`,
    height,
  };

  return (
    <div className={classNames("ScrollShadow", className)}>
      <div className={`scrollArea flex-grow fit ${scrollClass}`}>
        <div className="scrollable scrollY" ref={scrollArea}>
          {children}
        </div>
        <div className="scrollNav scrollNavUp" style={scrollNavStyles}></div>
        <div className="scrollNav scrollNavDown" style={scrollNavStyles}></div>
      </div>
    </div>
  );
};

ScrollShadow.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  color: PropTypes.string,
  height: PropTypes.number,
};

ScrollShadow.defaultProps = {
  color: "rgba(0, 0, 0, 0.75)",
  height: 5,
};

export default ScrollShadow;
