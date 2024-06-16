export const SvgIcon = ({
  name,
  size,
  ...props
}: {
  name: string;
  size?: number;
  className?: string;
  onClick?: any;
}) => {
  return (
    <svg style={size ? { width: size, height: size } : {}} {...props} aria-hidden='true'>
      <use href={`#icon-${name}`} />
    </svg>
  );
};
