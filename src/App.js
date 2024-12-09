import React from 'react';
import './App.css';
import ticketsale from './ticketsale';
import Web3 from './web3';

const web3 = new Web3(window.ethereum);

const managerAddress = '0x6b5369bECd0cCAD7fef20e5c138b794D39b1780C';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            message: '',
            tickets: [],
            address: '',
        };
        this.handleChangeId = this.handleChangeId.bind(this);
        this.handleChangeAddress = this.handleChangeAddress.bind(this);
    }

    async componentDidMount() {

        try {
             const ticketsCount = 3;
                const allTickets = [];
                for (let i = 0; i < ticketsCount; i++) {
                    try {
                        const ticket = await ticketsale.methods.tickets(i).call();
                        console.log(`Ticket ${i}:`, ticket);
                        const priceInWei = web3.utils.toWei(ticket[2].toString(), 'ether');
                        allTickets.push({
                            id: ticket[1].toString(),
                            price: priceInWei.toString(),
                        });
                    } catch (err) {
                        console.error(`Error fetching ticket ${i}:`, err);
                    }
                }
                this.setState({ tickets: allTickets });
        } catch (error) {
            console.error("Error fetching tickets:", error);
        }
    }

    handleChangeId(event) {
        this.setState({ id: event.target.value });
    }
    handleChangeAddress(event) {
        this.setState({ address: event.target.value });
    }

    handleSubmitBuyTicket = async (event) => {
        event.preventDefault();
        alert(`
            ____Your Details____\n
            ID: ${this.state.id}
            Price ${this.state.price}
        `);
        const accounts = await web3.eth.getAccounts();
        this.setState({ message: "Waiting on transaction success..." });
        try {
            await ticketsale.methods.buyTicket(this.state.id).send({
                from: accounts[0],
                value: web3.utils.toWei(this.state.price, 'ether'),
            });
        } catch (error) {
            alert("Ticket ID is not valid or you do not have enough funds!");
        }
    };

	handleSubmitOfferSwap = async (event) => {
        event.preventDefault();
        alert(`
            ____Details____\n
            Asking ID to swap: ${this.state.id}
        `);
        const accounts = await web3.eth.getAccounts();
        this.setState({ message: "Waiting on transaction success..." });
        try {
            await ticketsale.methods.offerSwap(this.state.id).send({
                from: accounts[0],
            });
        } catch (error) {
            alert("Ticket ID is not valid or you do not have enough funds!");
        }
    };
    
    handleSubmitRefundTicket = async (event) => {
        event.preventDefault();
        alert(`
            ____Details____\n
            About to refund ticket
        `);
        const accounts = await web3.eth.getAccounts();
        this.setState({ message: "Waiting on transaction success..." });
        try {
            await ticketsale.methods.resaleTicket(this.state.tickets[0].price).send({
                from: accounts[0],
            });
            ticketsale.methods.acceptResale(ticketsale.methods.getTicketOf(accounts[0])).send({
            	from: managerAddress,
            });
        } catch (error) {
            alert("Ticket ID is not valid or you do not have enough funds!");
        }
    };
    handleSubmitAcceptOffer = async (event) => {
        event.preventDefault();
        alert(`
            ____Your Details____\n
            ID of ticket receiving: ${this.state.id}
        `);
        const accounts = await web3.eth.getAccounts();
        this.setState({ message: "Waiting on transaction success..." });
        try {
            await ticketsale.methods.acceptOffer(this.state.id).send({
                from: accounts[0],
            });
        } catch (error) {
            alert("Ticket ID is not valid or you do not have enough funds!");
        }
    };
    
	handleSubmitGetTicketOf = async (event) => {
    		event.preventDefault();
    		alert(`
       		____Your Details____\n
        		Address of account to check: ${this.state.address}
    		`);
    		const accounts = await web3.eth.getAccounts();
    		this.setState({ message: "Waiting on transaction success..." });
    		try {
        		const id = await ticketsale.methods.getTicketOf(this.state.address).call(/*{
            		from: accounts[0],
        		}*/); 
        		alert("Your ticket ID is: " + id.toString());
    		} catch (error) {
        		alert("Ticket address is not valid");
    		}
	};



    render() {
        return (
            <div>
                <h2>TicketSale Contract</h2>
                <div>
                    {this.state.tickets.length === 0 ? (
                        <p>No tickets available.</p>
                    ) : (
                        this.state.tickets.map((ticket, index) => (
                            <div key={index}>
                                <p>ID: {ticket.id}</p>
                                <p>Price: {web3.utils.toWei(ticket.price, 'ether')} WEI</p>
                                <hr />
                            </div>
                        ))
                    )}
                </div>

                <form onSubmit={this.handleSubmitBuyTicket}>
                    <h4>Buy Ticket</h4>
                    <div>
                        <label>Enter Ticket ID </label>
                        <input
                            placeholder="Enter ID"
                            onChange={this.handleChangeId}
                        />
                    </div>
                    <div>
                        <button name="buyTicket">Buy a Ticket</button>
                    </div>
                </form>
                
                
                
		<form onSubmit={this.handleSubmitOfferSwap}>
                    <h4>Offer Swap</h4>
                    <div>
                        <label>Enter Ticket ID </label>
                        <input
                            placeholder="Enter ID"
                            onChange={this.handleChangeId}
                        />
                    </div>
                    <div>
                        <button name="offerSwap">Offer Swap</button>
                    </div>
                </form>
                
                
                
                <form onSubmit={this.handleSubmitAcceptOffer}>
                    <h4>Accept Offer</h4>
                    <div>
                        <label>Enter Ticket ID </label>
                        <input
                            placeholder="Enter ID"
                            onChange={this.handleChangeId}
                        />
                    </div>
                    <div>
                        <button name="acceptSwap">Accept Swap</button>
                    </div>
                </form>
                
                
                <form onSubmit={this.handleSubmitGetTicketOf}>
                    <h4>Get Ticket Number</h4>
                    <div>
                        <label>Enter Address </label>
                        <input
                            placeholder="Enter Address"
                            onChange={this.handleChangeAddress}
                        />
                    </div>
                    <div>
                        <button name="getTicketOf">Get Ticket Number</button>
                    </div>
                </form>
                
                
                <form onSubmit={this.handleSubmitRefundTicket}>
                    <h4>Refund Ticket</h4>
                    <div>
                        <button name="refundTicket">Refund Ticket</button>
                    </div>
                </form>
                {this.state.message && <p>{this.state.message}</p>}
            </div>
        );
    }
}

export default App;

