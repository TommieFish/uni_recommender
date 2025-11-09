import {AiFillGithub} from "react-icons/ai";
import {MdEmail } from "react-icons/md";

const socialMediaLinks = 
[
  //links to social media
  { href : "https://github.com/TommieFish", Icon : AiFillGithub, label : "Github"},
  {href : "mailto:support@unirecommender.uk", Icon: MdEmail, label:"Support Email"},
];

export function Footer()
{
  return (
    <footer className = "py-8 max-w-[1200px] mx-auto px-4">
      <div className="flex sm:justify-between justify-center items-cetner gap-10 max-sm:flex-col mt-12">
        <p className="text-gray-700 dark:text-gray-200">© UniRecommender 2025. All rights reserved.</p>

        <ul className ="flex flex-wrap gap-5"
          >{socialMediaLinks.map(({href, Icon, label}) => ( //go through each link and create the item
            <li key={label}>
              <a
                href={href}
                aria-label={label}
                target="_blank" //new tab
                rel="noopener noreferrer" //prevents new tap where new page could redirect original page to malicious site, hides where user came from (privacy)
                className = "text-gray-700 dark:text-gray-400 flex items-center justify-center w-10 hover:text-gray-300"
              >
            <Icon size={30}/>
            </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}