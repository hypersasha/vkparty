import React, {Component} from 'react';
import {Root, View, Panel, PanelHeader, HeaderButton, ConfigProvider} from "@vkontakte/vkui/src";

import {platform, IOS} from './lib/platform';
import HomeScreen from "./components/Views/HomeScreen/HomeScreen";
import AddParty from "./components/Views/NewParty/AddParty";
import Party from "./components/Views/Party/Party";

import connect from '@vkontakte/vkui-connect';


const osname = platform();

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            activeView: 'homeScreen',
            activePanel: 'raves'
        };

        this.OnChangeView = this.OnChangeView.bind(this);
        this.OnChangePanel = this.OnChangePanel.bind(this);
    }

    /**
     * Changes current active view.
     */
    OnChangeView(view_id) {
        this.setState({
            activeView: view_id
        });

        if (this.state.activeView === "homeScreen") {
            if (window.location.hash) {
                this.OnChangePanel("party-info");
            }
        }
    }

    OnChangePanel(panel_id) {
        this.setState({activePanel: panel_id });
    }

    componentDidMount() {
        if (this.state.activeView === "homeScreen") {
            if (window.location.hash) {
                this.OnChangePanel("party-info");
            }
        }
    }

    render() {
        return (
            <Root activeView={this.state.activeView}>
                <View id={"homeScreen"} activePanel={this.state.activePanel}>
                    <Panel id={"raves"}>
                        <HomeScreen onChangeView={this.OnChangeView} onChangePanel={this.OnChangePanel} />
                    </Panel>
                    <Panel id={"party-info"}>
                        <Party onChangePanel={this.OnChangePanel} />
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
