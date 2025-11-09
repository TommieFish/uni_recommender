import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge" //merges classname and resolves conflicts (like p-2 p-4 -> p-4)


export function cn(...inputs: ClassValue[]) //takes in any number of ClassName inputs, and returns a cleaned className outpu
{  
return twMerge(clsx(inputs))
}
