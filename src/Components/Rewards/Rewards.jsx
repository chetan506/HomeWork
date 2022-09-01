import React, { useEffect, useState } from "react";
import { MockData } from "./MockData";
import { useCallback } from "react";

export const Rewards = ({ user }) => {
  const [transactions, setTransactions] = useState([]);
  const [rewards, setRewards] = useState({});

  const fetchTransactions = (noOfMonths = 3, date = new Date()) => {
    // return axios.fetch(('')) using mock data
    return new Promise((resolve, reject) => {
      if (MockData) resolve(MockData);
      else reject("Failed to Ger the Data");
    });
  };

  const calculateRewards = (transactionAmount) => {
    if (transactionAmount > 100) {
      return 50 + (transactionAmount - 100) * 2;
    } else if (transactionAmount > 50) {
      return transactionAmount - 50;
    } else {
      return 0;
    }
  };

  const getTransactionMonth = (date) => {
    return new Date(date).toLocaleString("default", { month: "long" });
  };

  const setRewardsPerCustomer = useCallback(() => {
    let rewards = {};
    transactions.forEach((transaction) => {
      const customerId = transaction.customerId;
      const month = getTransactionMonth(transaction.transactionDate);
      const rewardForTransaction = calculateRewards(
        +transaction.transactionAmount
      );
      if (customerId in rewards) {
        if (month in rewards[customerId]) {
          rewards[customerId].monthlyRewards[month] =
            rewards[customerId].monthlyRewards[month] + rewardForTransaction;
          rewards[customerId].total =
            rewards[customerId].total + rewardForTransaction;
        } else {
          rewards[customerId].monthlyRewards[month] = rewardForTransaction;
          rewards[customerId].total =
            rewards[customerId].total + rewardForTransaction;
        }
      } else {
        rewards[customerId] = {
          total: rewardForTransaction,
          monthlyRewards: {},
        };
        rewards[customerId].monthlyRewards[month] = rewardForTransaction;
      }
    });
    setRewards({ ...rewards });
  }, [transactions]);

  useEffect(() => {
    fetchTransactions().then((res) => {
      if (res?.data) {
        setTransactions(res.data);
        setRewardsPerCustomer();
      }
    });
  }, [setRewardsPerCustomer]);

  return (
    <div className={"tableWrapper"}>
      <table>
        <thead>
          <tr>
            <th>Customer Id</th>
            <th>Monthly Rewards</th>
            <th>Total Rewards</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(rewards).map(([customerId, rewards]) => {
            return (
              <>
                <tr>
                  <td>{customerId}</td>
                  <td>
                    {Object.entries(rewards.monthlyRewards).map(
                      ([month, rewards]) => {
                        return (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-around",
                            }}
                          >
                            <p>{month}:</p>
                            <p>{rewards}</p>
                          </div>
                        );
                      }
                    )}
                  </td>
                  <td>{rewards.total}</td>
                </tr>
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
