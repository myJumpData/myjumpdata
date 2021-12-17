import {Link} from "react-router-dom";

export function Section({
                          children,
                          heading,
                          transparent,
                          button,
                        }: {
  children?: any;
  heading: string;
  transparent?: boolean;
  button?: any;
}) {
  return (
    <section className={"py-8 " + (!transparent && "bg-white border-b")}>
      <div className="container max-w-6xl mx-auto m-8 relative">
        <h1
          className={
            "my-2 text-2xl lg:text-4xl font-bold text-center " +
            (!transparent && "text-gray-800")
          }
        >
          {heading}
        </h1>
        {button && (
          <ul
            className="text-black absolute top-0 right-0 left-0 justify-end w-3/6 mx-auto items-center hidden md:flex">
            {button.map((button: any) => {
              return (
                <li key={button.name}>
                  <Link
                    to={button.to}
                    className={
                      "w-full justify-center inline-block text-center py-1 transition duration-500 ease-in-out px-2" +
                      (!transparent
                        ? "focus:text-yellow-500 hover:text-yellow-500 "
                        : "focus:text-black hover:text-black ")
                    }
                  >
                    <span className="inline-block text-2xl lg:text-4xl">
                      {button.icon}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
        <div
          className={
            " h-1 mx-auto w-3/6 opacity-25 " +
            (!transparent ? "gradient" : "bg-white")
          }
        />
        <div className={"p-8 " + (!transparent && "text-gray-800")}>
          {children}
        </div>
      </div>
    </section>
  );
}
