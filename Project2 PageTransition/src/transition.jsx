import { motion } from "framer-motion";

const transition = (Component) => {
  return function TransitionWrapper(props) {
    return (
      <>
        <Component {...props} />
        <motion.div
          className="slide-in"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 0 }}
          exit={{ scaleY: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
        <motion.div
          className="slide-out"
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          exit={{ scaleY: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </>
    );
  };
};

export default transition;
