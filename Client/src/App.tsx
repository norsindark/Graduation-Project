import {
    RouterProvider,
} from "react-router-dom";
import {router} from "./routers/Router.tsx";
// import {Counter} from "./pages/Counter.tsx";


function App() {
    return (
        <>
            {/*<Counter/>*/}
            <RouterProvider router={router} />
        </>
    )
}

export default App
