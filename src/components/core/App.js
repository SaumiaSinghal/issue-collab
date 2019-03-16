import React from "react";
import Title from "./Title";
import SearchResults from "../search/SearchResults";
import "../../style.scss";
import LabelToggles from "../search/LabelToggles.js";
import LanguageToggles from "../search/LanguageToggles.js";

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggledLanguages: [],
      toggledLabels: [],
      providedText: "",
      issueState: "open",
      results: {}
    };
  }

  handleTextChange = event => {
    this.setState({ providedText: event.target.value });
  };

  onToggle = event => {
    const { toggledLabels } = this.state;
    const stateArray = [...toggledLabels];
    const index = stateArray.indexOf(event.target.name);

    if (index !== -1) {
      stateArray.splice(index, 1);
      this.setState({ toggledLabels: stateArray });
    } else {
      this.setState({
        toggledLabels: [...toggledLabels, event.target.name]
      });
    }
  };

  onToggleLanguage = event => {
    const { toggledLanguages } = this.state;
    const stateArray = [...toggledLanguages];
    const index = stateArray.indexOf(event.target.name);

    if (index !== -1) {
      stateArray.splice(index, 1);
      this.setState({ toggledLabels: stateArray });
    } else {
      this.setState({
        toggledLanguages: [...toggledLanguages, event.target.name]
      });
    }
  };

  formatUrl = () => {
    const {
      issueState,
      toggledLabels,
      toggledLanguages,
      providedText
    } = this.state;
    const baseUrl = "https://api.github.com/search/issues?q=type:issue";
    const sortOptions = "&sort=created&order=desc&per_page=30";
    let finalLabels = "";
    let finalLanguages = "";
    let finalText = "";

    finalLabels = toggledLabels.map(label => "+label:" + label).join("");

    finalLanguages = toggledLanguages
      .map(language => "+language:" + language)
      .join("");

    if (providedText !== "") {
      finalText = "+" + providedText;
    }

    const completeUrl =
      baseUrl +
      finalLabels +
      finalLanguages +
      finalText +
      `+state:${issueState}` +
      sortOptions;

    return completeUrl;
  };

  getIssues = async () => {
    const finalUrl = this.formatUrl();

    const response = await fetch(finalUrl);
    const json = await response.json();

    this.setState({ results: json, finalUrl: finalUrl }, () =>
      console.log("results", this.state.results)
    );
  };

  render() {
    const { results, providedText } = this.state;

    return (
      <div className="wrapper">
        <Title />

        <div className="searchbar">
          <h3>Enter Your Search</h3>
          <input
            type="text"
            name="search-text"
            value={providedText}
            onChange={this.handleTextChange}
          />
          <button onClick={this.getIssues}>Get Results</button>
        </div>

        <LabelToggles onToggle={this.onToggle} />
        <LanguageToggles onToggle={this.onToggleLanguage} />

        {/* temporary */}
        <h3>{this.state.finalUrl}</h3>

        {results.items && <SearchResults results={results} />}
      </div>
    );
  }
}

export default SearchBar;
