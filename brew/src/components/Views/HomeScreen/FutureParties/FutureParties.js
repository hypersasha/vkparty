import React, {Component} from 'react';
import {Avatar, Cell, List} from "@vkontakte/vkui/src";

import {getTextDate} from "../../../../lib/Utils";
import PropTypes from 'prop-types';

class FutureParties extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        const {futureParties, ...restProps} = this.props;
        let parties = futureParties.map((party) => {
            let date = party.date;
            if (date) {
                date = new Date(date);
                let timezoneOffset = date.getTimezoneOffset() / 60;
                date.setHours(date.getHours() + timezoneOffset);
                date = getTextDate(date);
            } else {
                date = "Дата не указана";
            }
            let ownerName = "Организатор";
            if (party.owner && party.owner.first_name && party.owner.last_name) {
                ownerName = party.owner.first_name + ' ' + party.owner.last_name;
            }
            return <Cell
                key={party.pid}
                before={<Avatar
                    src={(party.owner && party.owner.photo ? party.owner.photo : '')}
                    size={72}/>}
                expandable={true}
                size="l"
                description={ownerName}
                bottomContent={
                    <div className="rave--event-date">{date}</div>
                }
                onClick={() => {this.props.onOpenParty(party.pid)}}
            >
                {party.title || "Без Названия"}
            </Cell>
        });
        return (
            <List>
                {parties}
            </List>
        )
    }
}

FutureParties.propTypes = {
    onOpenParty: PropTypes.func.isRequired,
    futureParties: PropTypes.array.isRequired
};



export default FutureParties;