import React from 'react';
import HomePage from './pages/home-page';
import 'semantic-ui-css/semantic.min.css';

function App() {
    return (
        {
            let run2 = () => {
                const resultArray = a.split(' ');
                resultArray.reduce((accum, current) => {
                    const b = current;
                    const c = `${accum[accum.length]} ${current}`

                    console.log(b, '\n', c)
                    // accum.push(current.includes('px') ? current :`${accum[accum.length]} ${current}`);
                    accum.push(b);
                    return [...accum];
                }, [])

                return resultArray;
            }
        }
        < HomePage />
    );
}

export default App;
