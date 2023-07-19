import { DetailedHTMLProps, HTMLAttributes, ReactElement } from "react";
import downArrow from "./dropdown-arrow.svg";
import close from "./close.svg";
import remove from "./remove.svg";
import add from "./add.svg";
import edit from "./edit.svg";
import star from "./star.svg";
import starFilled from "./star-filled.svg";
import complete from "./complete.svg";
import completeFilled from "./complete-filled.svg";

const components = {
  downArrow: downArrow,
  close: close,
  delete: remove,
  add: add,
  edit: edit,
  star: star,
  starFilled: starFilled,
  complete: complete,
  completeFilled: completeFilled,
};

type Props = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & { kind: keyof typeof components };

const Icon = ({ kind, children, ...props }: Props): ReactElement => {
  const SvgIcon = components[kind];
  return (
    <div {...props}>
      <SvgIcon className="fill-current h-[1em]" aria-label={kind} />
      {children}
    </div>
  );
};

export default Icon;
