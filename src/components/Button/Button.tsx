import { ButtonProps } from "./Button.props";

import style from "./Button.module.scss";

import cn from "classnames";

const defaultProps = {
  as: "a",
};

const Button = (props: ButtonProps): JSX.Element => {
  const { as: Component, className, children, ...rest } = props;

  return (
    <Component className={cn(style.button, "btn", className)} {...rest}>
      {children}
    </Component>
  );
};

Button.defaultProps = defaultProps;

export default Button;
