import {
    RouterProvider,
} from "react-router-dom";
import {router} from "./routers/Router.tsx";
import Loading from "./components/Loading/Loading.tsx";
// import {Counter} from "./pages/Counter.tsx";


function App() {
    return (
        <>
            {/*<Counter/>*/}
            <RouterProvider router={router} /> : <Loading/>
        </>
    )
}

export default App
