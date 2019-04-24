import React, {Component} from 'react';
import {Root, View, Panel, PanelHeader, HeaderButton} from "@vkontakte/vkui/src";

import {platform, IOS} from './lib/platform';
import HomeScreen from "./components/Views/HomeScreen/HomeScreen";
import AddParty from "./components/Views/NewParty/AddParty";


const osname = platform();

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            activeView: 'homeScreen'
        };

        this.OnChangeView = this.OnChangeView.bind(this);

    }

    /**
     * Changes current active view.
     */
    OnChangeView(view_id) {
        this.setState({
            activeView: view_id
        })
    }

    render() {
        return (
            <Root activeView={this.state.activeView}>
                <View id={"homeScreen"} activePanel={"raves"}>
                    <Panel id={"raves"}>
                        <HomeScreen onChangeView={this.OnChangeView} />
                    </Panel>
                </View>
                <View id={"newParty"} activePanel={"newParty-form"}>
                    <Panel id={"newParty-form"}>
                        <AddParty onChangeView={this.OnChangeView} />
                    </Panel>
                </View>
            </Root>
        );
    }
}

export default App;
