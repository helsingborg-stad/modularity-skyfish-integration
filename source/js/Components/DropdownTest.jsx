'use strict';

const Button = require('./Button.jsx');
const Dropdown = require('./Dropdown.jsx');
// const {Button, Dropdown} = require('../../../node_modules/hbg-react-components/src/index.js');
// // const {Button} = require('hbg-react-test');

module.exports = class extends React.Component {
    constructor(props)
    {
        super(props);
        this.state = {
            current: 0,
            location: [
                {
                    id: 0,
                    title: 'New York',
                    selected: false,
                    key: 'location'
                },
                {
                    id: 1,
                    title: 'Dublin',
                    selected: false,
                    key: 'location'
                },
                {
                    id: 2,
                    title: 'California',
                    selected: false,
                    key: 'location'
                },
                {
                    id: 3,
                    title: 'Istanbul',
                    selected: false,
                    key: 'location'
                },
                {
                    id: 4,
                    title: 'Izmir',
                    selected: false,
                    key: 'location'
                },
                {
                    id: 5,
                    title: 'Oslo',
                    selected: false,
                    key: 'location',
                    href: 'https://single.local/post-1/'
                }
            ]
        }
    }

    setCurrent(id, key)
    {
        this.setState({current: id});
    }

    toggleSelected(id, key)
    {
      let temp = this.state[key]
      temp[id].selected = !temp[id].selected
      this.setState({
        [key]: temp
      })
    }

    myClick(e)
    {
        console.log(e);
    }

    render()
    {
        // console.log(Button + 'lol');
        return (
            <div>
            <Button color="primary" onClick={this.myClick.bind(this)}>Test</Button>
            <Dropdown
              title="Select location"
              list={this.state.location.map((item) => {
                item.clickAction = this.setCurrent.bind(this);

                return item;
              })}
              toggleItem={this.toggleSelected.bind(this)}
            />
            </div>
        );
    }
}


