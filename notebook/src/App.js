import Content from "./layouts/Content";
import api from "./api/notes";

function App() {
    return (
        <div>
            <Content api={api}/>
        </div>
    );
}

export default App;
