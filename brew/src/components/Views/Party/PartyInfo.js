import React, {Component} from 'react';
import {Avatar, Button, Cell, Div, Footer, Group, Header, InfoRow, Link, List} from "@vkontakte/vkui/src";
import CreatePartyForm from "../NewParty/CreatePartyForm";
import PropTypes from 'prop-types';
import {getTextDate, SERVER_URL, declOfNum} from "../../../lib/Utils";

import axios from 'axios';

import connect from '@vkontakte/vkui-connect';

class PartyInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editingGuests: false
        };

        this.InviteSelf = this.InviteSelf.bind(this);
        this.InviteFriends = this.InviteFriends.bind(this);
        this.ShareEvent = this.ShareEvent.bind(this);
        this.ToggleEdit = this.ToggleEdit.bind(this);
        this.onGuestRemoved = this.onGuestRemoved.bind(this);
        this.UpdateSettings = this.UpdateSettings.bind(this);
        this.onFriendsResponse = this.onFriendsResponse.bind(this);

        // VKWebAppGetFriendsResult
        connect.subscribe(this.onFriendsResponse);
    }

    /**
     * Opens VK app window for inviting friends.
     * @constructor
     */
    InviteFriends() {
        connect.send("VKWebAppGetFriends", { multi:true });
    }

    /**
     * Invites self user.
     * @constructor
     */
    InviteSelf() {
        if (this.props.userInfo) {
            if (this.props.userInfo.first_name && this.props.userInfo.last_name) {
                this.props.onShowScreenSpinner();
                axios.post(SERVER_URL + '/guests', {
                    pid: this.props.partyId,
                    guests: [{
                        id: this.props.userId,
                        first_name: this.props.userInfo.first_name,
                        last_name: this.props.userInfo.last_name,
                        photo_200: this.props.userInfo.photo_200
                    }]
                }).then(response => {
                    if (response.data && response.data.isOK) {
                        this.props.onGuestAdded();
                    }
                }).catch(err => {
                    console.error(err);
                })
            }
        }
    }

    /**
     * Opens dialog to share app via VK messages or Posts.
     * @constructor
     */
    ShareEvent() {
        connect.send("VKWebAppShare", {link: "https://vk.com/app6957986" + window.location.hash});
    }

    ToggleEdit() {
        this.setState(prevState => ({
            editingGuests: !prevState.editingGuests
        }));
    }

    onGuestRemoved(gid) {
        this.props.onGuestRemoved(gid);
        axios.delete(SERVER_URL + '/guest', {
            params: {
                pid: this.props.partyId,
                guest_id: gid
            }
        }).then((response) => {
            if (response.data.isOK) {
                this.props.onGuestAdded();
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    onFriendsResponse(e) {
        if (e.detail.type === "VKWebAppGetFriendsResult") {
            let data = e.detail.data;
            if (!data || !data.users || !data.users.length === 0) {
                this.props.onGuestAdded();
            } else {
                // Add collected friends to invites on the server.
                let chosenFriends = data.users;
                if (chosenFriends.length > 0) {
                    this.props.onShowScreenSpinner();
                    axios.post(SERVER_URL + '/guests', {
                        pid: this.props.partyId,
                        guests: chosenFriends
                    }).then(response => {
                        if (response.data.isOK) {
                            this.props.onGuestAdded();
                        }
                    }).catch(err => {
                        console.error(err);
                    })
                }
            }
        }
    }

    /**
     * Updates party settings. Only for admins.
     * @param formData - party info, contains title, date, private fields.
     * @constructor
     */
    UpdateSettings(formData) {
        this.props.onShowScreenSpinner();
        axios.patch(SERVER_URL + '/party', {
            pid: this.props.partyId,
            user_id: this.props.userId,
            patch: formData
        }).then(response => {
            if (response && response.data && response.data.isOK) {
                this.props.onGuestAdded();
            }
        }).catch((err) => {
            console.error(err);
        })
    }

    componentWillUnmount() {
        connect.unsubscribe(this.onFriendsResponse);
    }

    render() {

        const {guests, isOwner, ...restProps} = this.props;

        // Compose date for settings.
        let objectDate = null;
        let date = this.props.date;
        let optionDate = null;
        if (!this.props.date) {
            date = "Дата не указана";
        } else {
            objectDate = new Date(date);
            let timezoneOffset = objectDate.getTimezoneOffset() / 60;
            objectDate.setHours(objectDate.getHours() + timezoneOffset);
            date = getTextDate(objectDate);
            optionDate = objectDate.getFullYear() + '-' + (objectDate.getMonth()+1) + '-' + objectDate.getDate();
        }

        let ownerName = "Организатор";
        if (this.props.owner && this.props.owner.first_name && this.props.owner.last_name) {
            ownerName = this.props.owner.first_name + ' ' + this.props.owner.last_name;
        }

        // Compose guests list
        let partyGuests = guests.map((guest) => {
           return <Cell
               key={guest.user_id}
               removable={this.state.editingGuests}
               removePlaceholder={"Исключить"}
               onRemove={() => { this.onGuestRemoved(guest.user_id); }}
               before={<Avatar
                   src={guest.photo}
                   size={48}/>}>
               {guest.first_name + ' ' + guest.last_name}
           </Cell>
        });

        const isGuest = (guests.findIndex((guest) => {
            return guest.user_id === this.props.userId;
        }) >= 0);

        return(
            <div id="mainInfo">
                {/* Main information and avatar */}
                <Group style={{marginTop: 60}}>
                    <Cell
                        before={<Avatar
                            src={(this.props.owner && this.props.owner.photo ? this.props.owner.photo : '')}
                            size={80}/>}
                        size="l"
                        multiline={true}
                        description={<div>{ownerName}<div className="rave--event-date">{date}</div></div>}
                        bottomContent={
                            <div>
                                <Button size="m"
                                        onClick={this.ShareEvent}
                                        level={"secondary"}>Поделиться событием</Button>
                            </div>
                        }
                    >
                        {this.props.title}
                    </Cell>
                </Group>
                {this.props.info && this.props.info.length > 0 ?
                    <Group>
                        <Div>
                            <InfoRow title={"Дополнительная информация"}>
                                {this.props.info}
                            </InfoRow>
                        </Div>
                    </Group>
                    : ''}
                <Group>
                    <Header level="2" aside={
                        (isOwner ? <Link onClick={this.ToggleEdit}>{this.state.editingGuests ? 'Готово' : 'Изменить'}</Link> : '')
                    }>участники</Header>
                    <List>
                        {partyGuests.length > 0 ? partyGuests : <Footer>Вечеринка наедине с собой - это замечатльно, но хорошие компании никто не отменял.</Footer>}
                    </List>
                    {
                        !isOwner && !isGuest && !this.props.private ?
                            <Div>
                                <Button size="xl" align="center" onClick={this.InviteSelf}>Присоединиться</Button>
                                <Footer>Это свободная вечеринка, Вы можете присоединиться без приглашения.</Footer>
                            </Div>
                            :
                            <Div style={{display: 'flex'}}>
                                <Button size="xl" align="center" onClick={this.InviteFriends}>Пригласить друзей</Button>
                            </Div>

                    }
                </Group>
                <Footer>{partyGuests.length} {declOfNum(partyGuests.length, ['участник','участника','участников'])}</Footer>
                {this.props.isOwner ?
                    <Group title={"Настройки"}>
                        <CreatePartyForm
                            onSubmit={this.UpdateSettings}
                            title={this.props.title}
                            date={optionDate}
                            private={this.props.private}
                            maxMovies={this.props.maxMovies}
                            info={this.props.info}
                            submitButtonText={"Сохранить"}
                        />
                    </Group>
                    :
                    ''
                }
            </div>
        );
    }
}

PartyInfo.propTypes = {
    date: PropTypes.string,
    title: PropTypes.string,
    private: PropTypes.bool
};

PartyInfo.defaultProps = {
    title: "Без Названия",
    private: false
};

export default PartyInfo;