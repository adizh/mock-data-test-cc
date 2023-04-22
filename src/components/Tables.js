import React, { Component } from "react";
import data from "../mock_stores.json";
import Table from "react-bootstrap/Table";
export default class Tables extends Component {
  state = {
    inputValue: "",
    computedValues: [],
  };

  handleInput = (elem, id) => {
    this.setState({ inputValue: +elem.target.value });
    let value = +elem.target.value;
    let negInput = Array.from(document.querySelectorAll("input")).find(
      (elem) => elem.getAttribute("dataid") === id
    );
    if (value < 0) {
      negInput.style.border = "1px solid red";
    } else {
      negInput.style.border = "1px solid rgb(212,212,212)";
    }
  };

  getValues = (id) => {
    let store = data.find((item) => item.months.find((e) => e.id === id));
    let eachMon = store.months.find((e) => e.id === id);
    if (this.state.inputValue === 0) {
      eachMon.value = 0;
    }
    if (this.state.inputValue > 0) {
      eachMon.value = this.state.inputValue;
    }

    let finalArr = data.map((item) => {
      return item.months.map((e) => {
        if (eachMon.id === e.id) {
          return { ...e, value: eachMon.value, storeName: item.store.name };
        } else {
          return { ...e, storeName: item.store.name };
        }
      });
    });
    this.setState({
      computedValues: finalArr.map((subArr) =>
        subArr.map((item) => ({
          value: +item.value,
          name: item.storeName,
          monthName: item.name,
        }))
      ),
    });
  };

  render() {
    const monthsNames = data
      .slice(0, 1)
      .map((e) =>
        e.months
          .slice(0, 12)
          .map((month) => <th key={month.id}>{month.name}</th>)
      );
    const computedSumEachMonth = this.state.computedValues.map((value) =>
      value.reduce((acc, rec) => acc + rec.value, 0)
    );
    let mainMonObj = [];
    this.state.computedValues.map((val) =>
      val.map((obj) =>
        mainMonObj.push({ name: obj.monthName, value: obj.value })
      )
    );
    const eachMonValues = Object.values(
      mainMonObj.reduce(
        (acc, n) => (
          // eslint-disable-next-line
          ((acc[n.name] ??= { ...n, value: 0 }).value += n.value), acc
        ),
        {}
      )
    );

    const totalOfTotals =
      eachMonValues.length > 0 &&
      eachMonValues.map((e) => e.value).reduce((acc, rec) => acc + rec, 0) +
        computedSumEachMonth.reduce((acc, rec) => acc + rec, 0);
    return (
      <>
        <Table bordered hover>
          <thead>
            <tr>
              <th>Store name</th>
              {monthsNames}
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item, index, array) => (
              <tr key={item.store.id}>
                <td>{item.store.name}</td>

                {item.months.map((mon) => (
                  <td key={mon.id}>
                    <input
                      type="number"
                      className="form-control w-100"
                      border-color="danger"
                      dataid={mon.id}
                      onChange={(e) => this.handleInput(e, mon.id)}
                      onKeyUp={() => this.getValues(mon.id)}
                    />
                  </td>
                ))}
                <td className="store-totals">
                  {computedSumEachMonth.length > 0 &&
                  array[index].store.name ===
                    this.state.computedValues[index][0].name
                    ? computedSumEachMonth[index]
                    : 0}
                </td>
              </tr>
            ))}
            <tr>
              <td>Total</td>
              {eachMonValues.length > 0 &&
                eachMonValues.map((val) => (
                  <td className="store-totals" key={val.name}>
                    {val.value}
                  </td>
                ))}
              {eachMonValues.length > 0 ? (
                <td className="store-totals">{totalOfTotals}</td>
              ) : (
                Array(12)
                  .fill(0)
                  .map((val, index) => (
                    <td className="store-totals" key={index}>
                      {val}
                    </td>
                  ))
              )}
            </tr>
          </tbody>
        </Table>
      </>
    );
  }
}
