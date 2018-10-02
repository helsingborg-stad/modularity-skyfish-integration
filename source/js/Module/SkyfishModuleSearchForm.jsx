module.exports = (props) => (
  <form onSubmit={props.submitSearchMethod}>
        <div className="grid">
            <div className="grid-xs-auto">
                <input type="text" onChange={props.searchMethod} />
            </div>
            <div className="grid-fit-content">
                <input type="submit" value="Submit" />
            </div>
        </div>
    </form>
);
