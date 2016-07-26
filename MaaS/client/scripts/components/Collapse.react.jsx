var React = require('react');
var ReactMotion = require('react-motion');
var Collapse = require('react-collapse');
var ReactHeight = require('react-height');

const style = {
  baseContainer: {
    maxWidth: 800,
    border: '1px solid rgba(3, 169, 244, 0.3)',
    borderRadius: 10
  },
  config: {
    paddingBottom: 20
  },
  container: {
    margin: 20
  },
  section: {
    marginTop: 50
  }
};

const text = [
  "You think water moves fast? You should see ice. It moves like it has a mind. Like it knows it killed the world once and got a taste for murder. After the avalanche, it took us a week to climb out. Now, I don't know exactly when we turned on each other, but I know that seven of us survived the slide... and only five made it out. Now we took an oath, that I'm breaking now. We said we'd say it was the snow that killed the other two, but it wasn't. Nature is lethal but it doesn't hold a candle to man.",
  "Your bones don't break, mine do. That's clear. Your cells react to bacteria and viruses differently than mine. You don't get sick, I do. That's also clear. But for some reason, you and I react the exact same way to water. We swallow it too fast, we choke. We get some in our lungs, we drown. However unreal it may seem, we are connected, you and I. We're on the same curve, just on opposite ends.",
  "Do you see any Teletubbies in here? Do you see a slender plastic tag clipped to my shirt with my name printed on it? Do you see a little Asian child with a blank expression on his face sitting outside on a mechanical helicopter that shakes when you put quarters in it? No? Well, that's what you see at a toy store. And you must think you're in a toy store, because you're here shopping for an infant named Jeb.",
  "You see? It's curious. Ted did figure it out - time travel. And when we get back, we gonna tell everyone. How it's possible, how it's done, what the dangers are. But then why fifty years in the future when the spacecraft encounters a black hole does the computer call it an 'unknown entry event'? Why don't they know? If they don't know, that means we never told anyone. And if we never told anyone it means we never made it back. Hence we die down here. Just as a matter of deductive logic."
];

const getText = num => text.slice(0, num).map((p, i) => <p key={i}>{p}</p>);

var CollapseElement = React.createClass({
    getInitialState() {
        return {isOpened: false, paragraphs: 0};
        
    },
    
    onChange({target: {value}}) {
    this.setState({paragraphs: parseInt(value, 10)});
  },
   render: function(){
       const {isOpened, paragraphs} = this.state;
       return (
            <div>
                <div style={style.config}>
                    <button onClick={() => this.setState({isOpened: !isOpened})}>Toggle</button>
                    &nbsp;
                    Paragraphs:
                    &nbsp;
                    <input type="range" step={1} min={0} max={4} 
                    value={paragraphs} onChange={this.onChange} />
                </div>
                <Collapse isOpened={isOpened} style={style.baseContainer}>
                    <div style={{padding: 10}}>
                        {paragraphs ? getText(paragraphs) : <p>No text</p>}
                    </div>
                </Collapse>
            </div>
    );
   } 
});

/*


*/


module.exports = CollapseElement;