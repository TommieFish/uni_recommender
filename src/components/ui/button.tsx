import * as React from "react";
import {Slot} from "@radix-ui/react-slot";
import{cva, type VariantProps} from "class-variance-authority";
import {cn} from "@/lib/utils";


//custonm button,  allows slot support (custom element, like <Link> not just <button>) easy switch styles (eva), allows for Merging classes (cn). Made mainly for later updates (such as multiple types of user... Easier to impliment)
//currently only used for Sign in Clients (OAuth), so if different OAuths added, further benefit as no need to write extra code. Adds more support than native HTML, makes UI consistant and scaleable
const buttonVariants = cva
(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", //creates an icon button that supports embedded SVG icons
  {
    variants: 
    {
      //sets variant styles that are specified when calling button
      variant: {
        default: "bg-primary text-primary-foreground shadow-sm hover-bg-destructive/90", //darkens on hover, shadow, contrast with bg 
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90", //
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground", //border, small shadow, background to accent colour on hover and change text colour on hover
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost:"hover:bg-accent hover:text-accent-foreground", //no border or bg unless hover
        link : "text-primary underline-offset-4 hover:underline" //addes underline
      },

      //sets sizes to choose
      size:
      {
        default:"px-4 py-2 h-9",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      },
    },

    //defaults when no specify
    defaultVariants:
    {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> //inherits all standart HTML <button> attributes, but also adds my own variant and size settings from setup
{
  asChild? : boolean //lets render different element
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps> ( ({className, variant, size, asChild=false, ...props}, ref)=> {
  const Composition = asChild ? Slot : "button"; //defaults to <button>

  return (
    <Composition
      ref={ref}
      className= {cn (buttonVariants ({ variant, size, className}))}
      {...props}
    />
  )
})

Button.displayName = "Button";
export { Button, buttonVariants};