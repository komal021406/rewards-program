import React, {useState, useEffect, Fragment} from 'react';
import './App.css';
import data from './data';

function App() {
  const [loadedData, setloadedData] = useState({});
  const [cutomerRewards, setRewardsCalc] = useState({});
  const [CustomersTransactions, setCustomersTransactions] = useState([])
  const [customers, setCustomers] = useState([]);
  const [currentCustomer, setCurrentCustomer] = useState("");
  const [newTransaction, setNewTransaction] = useState({date: new Date(), amount:0 });

  useEffect(() => {
    setloadedData({...data});
    setCustomers([...Object.keys(data)]);
  }, []);

  const customerSelect= (value) => {
    setCurrentCustomer(value);
    let customerData = loadedData[value];

  let monthTotal = {
    5: {
      amounts: [],
      rewards: 0
    },
    6: {
      amounts: [],
      rewards: 0
    },
    7: {
      amounts: [],
      rewards: 0
    },
  };

    for(let i=0; i < customerData.length; i++) {
      let month = new Date(customerData[i]['date']);
      console.log("month" + month.getMonth());
      if(month.getMonth() + 1 == 5 || month.getMonth() +1 == 6 || month.getMonth() +1 == 7) {
        monthTotal[month.getMonth() + 1]['amounts'].push(customerData[i]['amount']);
      }
    }
    for (let key in monthTotal) {
      let totalRewards = 0;
      for(let i=0; i < monthTotal[key]['amounts'].length; i++) {
        let price = monthTotal[key]['amounts'][i];
        totalRewards = totalRewards + rewardPoints(price);
      }
      monthTotal[key]['rewards'] = totalRewards;
    }
    console.log("53" + monthTotal)
    setRewardsCalc({ ...monthTotal });
    setCustomersTransactions([ ...customerData ]);
  };

  const updateInput = (e) => {
    if (e.target.name === "date") {
      setNewTransaction({ ...newTransaction, ...{ date: e.target.value } });
    }
    if (e.target.name === "amount") {
      setNewTransaction({ ...newTransaction, ...{ amount: e.target.value } });
    }
  }
  const addTransaction = () => {
    let data = { ...loadedData };
    let month = new Date(newTransaction['date']);
    let newDate = [month.getMonth() + 1, month.getDate(), month.getFullYear()].join('/');
    if ((month.getMonth() + 1 == 5 || month.getMonth() + 1 == 6 || month.getMonth() + 1 == 7) && (month.getFullYear() ==2022)) {
      data[currentCustomer].push(newTransaction);
      setloadedData({ ...data });

      customerSelect(currentCustomer);
    } 
    setNewTransaction({ date: newDate, amount: 0 });
    }
  
  return (
    <div className="App">
       <h1>Welcome to Rewards Program</h1>
       <div className='customer-name'>
        <select onChange={e => customerSelect(e.target.value)} value={currentCustomer}>
          <option value="">Select customer for rewards calculation</option>
          {customers.map((item, index) => {
            return(
              <option key={index} value={item}>{item}</option>
            );
          })}
        </select>
        </div> 
        {Object.keys(cutomerRewards).length >0 &&
        <Fragment>
          <table className="customers">
            <thead>
              <tr>
                <th>Month</th>
                <th>RewardsPoints</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1st month of Reward (May)</td>
                <td>{cutomerRewards[5]["rewards"]}</td>
              </tr>
              <tr>
                <td>2nd month of Reward (June)</td>
                <td>{cutomerRewards[6]["rewards"]}</td>
              </tr>
              <tr>
                <td>3rd month of Reward (July)</td>
                <td>{cutomerRewards[7]["rewards"]}</td>
              </tr>
              <tr>
                <td>Total Rewards</td>
                <td>{cutomerRewards[5]["rewards"] + cutomerRewards[6]["rewards"] + cutomerRewards[7]["rewards"]}</td>
              </tr>
            </tbody>
          </table>
          <h2> Customer Transactions</h2>
          {CustomersTransactions.length >0 ?
          <table className="customers">
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Rewards Points</th>
              </tr>
            </thead>
            <tbody>
              {CustomersTransactions.map((item, index) => {
                return <tr key = {index}>
                  <td>{item["date"]}</td>
                  <td>{item["amount"]}</td>
                  <td>{rewardPoints(item["amount"])}</td>
                </tr>
              })}
            </tbody>
          </table>
          : <div>No transactions available</div>
          }
          <div>
            <h3>Do you like to add more transactions for for selected customer and May/June/July for the year 2022?</h3>
            <label>Date </label><input type="date" name="date" value={newTransaction.date} onChange={(e) => updateInput(e)}></input>
            <label>Amount</label><input type="number" name="amount" value={newTransaction.amount} onChange={(e) => updateInput(e)}></input>
            <button onClick={() => addTransaction()}>Add +</button>

          </div>
        </Fragment>
        }
    </div>
  );
}

export default App;

function rewardPoints(price) {
  console.log("price: " + price)
  let rewards = 0;
  if (price > 100) {
    rewards = (price - 100) * 2;
  }
  if (price > 50) {
    rewards = rewards + (price - 50);
  }
  console.log("rewards" + rewards)
  return rewards;
}