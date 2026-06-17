import { NavLink as RouterNavLink, NavLinkProps } from "react-router-dom";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface NavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  className?: string | ((props: { isActive: boolean }) => string);
  end?: boolean;
}

export function NavLink({ to, className, end, children, ...props }: NavLinkProps) {
  const pathname = usePathname();
  
  // Basic active check (can be refined if needed)
  const isActive = end ? pathname === to : pathname.startsWith(to);

  const resolvedClassName = typeof className === 'function' ? className({ isActive }) : className;

  return (
    <Link href={to} className={cn(resolvedClassName)} {...props}>
      {children}
    </Link>
  );
}

NavLink.displayName = "NavLink";

export { NavLink };
