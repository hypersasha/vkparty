import React, {Component} from 'react';
import {Avatar, Button, Cell, Div, Group, Header, Link, List} from "@vkontakte/vkui/src";

import PropTypes from 'prop-types';

class PartyGuests extends Component {
    constructor(props) {
        super(props);

    }

    render() {

        const {guests, ...restProps} = this.props;

        let guestList = [];
        if (guests) {
            guestList = guests.map((guest) => {
                return <Cell
                    key={guest.user_id}
                    removePlaceholder={"Исключить"}
                    className={}
                    before={<Avatar
                        src={"https:\\/\\/pp.userapi.com\\/c636719\\/v636719044\\/1e509\\/_-3LN6hoebk.jpg?ava=1"}
                        size={48}/>}
                    removable={false}>
                    {guest.first_name + ' ' + guest.last_name}
                </Cell>
            });
        }

        return (
            <Group description={"Люди, отмеченные серым цветом, не подтвердили своего участия."}>
                <Header level="2" aside={<Link>Изменить</Link>}>участники</Header>
                <List>
                    <Cell
                        removable={false}
                        removePlaceholder={"Исключить"}
                        before={<Avatar
                            src={"https://pp.userapi.com/c841227/v841227164/7c931/jiyCe7qzdJw.jpg?ava=1"}
                            size={48}/>}>
                        Александр Белов
                    </Cell>
                    <Cell
                        removable={false}
                        removePlaceholder={"Исключить"}
                        className={"guest--no-confirmed"}
                        before={<Avatar
                            src={"https:\\/\\/pp.userapi.com\\/c636719\\/v636719044\\/1e509\\/_-3LN6hoebk.jpg?ava=1"}
                            size={48}/>}>
                        Сергей Бродский
                    </Cell>
                    <Cell
                        removable={false}
                        removePlaceholder={"Исключить"}
                        before={<Avatar
                            src={"https:\\/\\/pp.userapi.com\\/Spw8dwKuU3tUCMeQiKb7VBdgq4uSF3EzZSBDIw\\/G09X32lEzoc.jpg?ava=1"}
                            size={48}/>}>
                        Артем Скачков
                    </Cell>
                </List>
                <Div style={{display: 'flex'}}>
                    <Button size="m" align="center">Пригласить друзей</Button>
                </Div>
            </Group>
        )
    }
}

PartyGuests.propTypes = {
    guests: PropTypes.array.isRequired
};

export default PartyGuests;