import { Children } from "react";

export default function MainLayout({ Children }: any) {
    return (
        <>
            <div className="">
                {Children}
            </div>
        </>
    )
}