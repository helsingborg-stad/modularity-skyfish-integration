module.exports = (props) => (
    <div>
        <div className="grid grid-va-middle">
            <div className="grid-xs-auto" key={props.current}>
                <input defaultValue={props.current} type="number" min="1" max={props.total} onChange={props.input} />
            </div>
            <div className="grid-fit-content">
                <span> / {props.total}</span>
            </div>


            <div className="grid-fit-content">
               <button onClick={props.prev}>Left</button>
            </div>
            <div className="grid-fit-content">
                <button onClick={props.next}>Right</button>
            </div>
        </div>
    </div>
);
