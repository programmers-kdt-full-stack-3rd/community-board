import { style } from "@vanilla-extract/css";

export const LogContainer = style({
    width : '90vw',
    alignContent : 'center'
});

export const LogStyle = style({
    width: '90vw',
    height: '50vh',
});


export const LogListStyle = style({
    display: 'grid',
    gridTemplateColumns: '3fr 1fr 1fr', 
    fontWeight: 'bold',
    marginLeft : '10px',
});

export const LogListDetail = style({
    display: 'grid',
    gridTemplateColumns: '3fr 1fr 1fr',
    alignItems: 'center',
    marginLeft : '10px',
});

export const UserStats = style({
    display: 'grid',
    width: '90vw',
    height: '20vh',
    gridTemplateColumns: '1fr 1fr 1fr',
    alignItems: 'center',
    textAlign: 'center',
});

export const StatsIcon = style({
    width: '50px',
    height: '50px',
    display: 'block', 
    margin: '0 auto', 
    ':hover': {
        backgroundColor: '#555555',
    },
});

export const StatsCount = style({
    fontSize: '16px',
    fontWeight: 'bold',
    marginTop: '5px', 
    marginBottom : '15px'
});

export const PaginationContainer = style({
    marginTop: 'auto', 
})

export const Title = style({
    display: 'flex',
    flexDirection: 'row',        
    alignItems: 'center',      
    justifyContent: 'center',    
    width: '100%',
    textAlign: 'center',       
  
});