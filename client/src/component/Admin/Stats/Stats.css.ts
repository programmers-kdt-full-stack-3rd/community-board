import { style } from "@vanilla-extract/css";

export const StatsStyle = style({
    width : '80vW',
    height : '100%',
});

export const MainTitle= style({
    width : '80vW',
    height : '100%',
    textAlign : 'left'
});


export const StatsTotal= style({
    display: 'grid',
    gridTemplateColumns: '3fr 1fr 3fr 1fr 3fr 1fr 3fr', 
    marginLeft : '10px',
    marginRight : '10px'
});

export const StatsLine= style({
    borderLeft : 'solid #b1b1b1',
});

export const BtnStyle= style({
    display: 'grid',
    gridTemplateColumns: '3fr 1fr 3fr 1fr 3fr', 
    marginBottom : '30px'
});
export const StatsBtn = style({
    backgroundColor: 'transparent', 
    border: 'none', 
    padding: '10px 20px', 
    cursor: 'pointer',
    fontSize: '16px', 
    outline: 'none', 
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    transition: 'background-color 0.3s, box-shadow 0.3s', 

    ':hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.1)', 
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', 
    },

    ':active': {
        backgroundColor: 'rgba(0, 0, 0, 0.2)', 
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4)', 
    },

    ':focus': {
        outline: 'none', 
    },
});

export const GraphContainer = style({
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'center',
    alignItems: 'center', 
    width: '100%', 
    height: 'auto', 
    marginTop: '50px',
});

export const GraphContainer2 = style({
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center', 
    alignItems: 'flex-start',
    width: '100%',
    padding: '0 10px',
    boxSizing: 'border-box' 
});


export const GraphStyle = style({
    flex: '1 0 300px',
    aspectRatio: '4/3', 
    marginTop: '10px',
    marginRight: '10px',
    boxSizing: 'border-box', 
    overflow: 'hidden', 
    minWidth : '500px'
});

