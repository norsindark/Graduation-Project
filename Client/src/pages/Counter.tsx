
import { useSelector, useDispatch } from 'react-redux';
import {
    increment,
    decrement,
    incrementByAmount,
    incrementAsync,
    selectCount,
} from '../redux/counter/counterSlice';
import {AppDispatch} from "../redux/store.ts";


export function Counter() {
    const count = useSelector(selectCount);
    const dispatch: AppDispatch = useDispatch(); // Khai báo kiểu cho dispatch


    return (
        <div>
            <h1>Counter: {count}</h1>
            <button onClick={() => dispatch(increment())}>Increment</button>
            <button onClick={() => dispatch(decrement())}>Decrement</button>
            <button onClick={() => dispatch(incrementByAmount(5))}>
                Increment by 5
            </button>
            <button onClick={() => dispatch(incrementAsync(5))}>
                Increment Async by 5
            </button>
        </div>
    );
}
