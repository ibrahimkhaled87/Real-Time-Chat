import useTicTacToe from "../hooks/tic-tac-toe/useTicTacToe";

export default function TicTacToe() {
    const {users, connection, available, myChar, payload, joined, board, win, handleClick, getConnection} = useTicTacToe();

    return <div className="ticTacToe">
        <div className="users">
            {!users? <p>Loading...</p> : users.map(user => (
                <div className="user" onClick={() => getConnection(user.username)}>
                    <img src="/images/profile.svg" alt="" />
                    <p>{user.username}</p>
                </div>
            )) }
        </div>

        <div className="area">
            {!win? null : <h2>{`${win} Wins`}</h2> }

            {!connection? <p>Choose user to start game</p> : <div className="game">
                <div className="user other_user" style={
                    !myChar? null : !available? {border: "3px solid green"} : null
                }>
                    {connection[0].user1===payload.username? connection[0].user2 : connection[0].user1}
                    <p className={`status ${joined}`}>{joined.charAt(0).toUpperCase() + joined.slice(1)}</p>
                    <p>{myChar==="X"? "O" : myChar==="O"? "X" : null}</p>
                </div>
                <div className="board">
                    {board.map((item, i) => <div className={`cell ${i}`} onClick={() => handleClick(i)}>
                        {item}
                    </div> )}
                </div>
                <div className="user me" style={
                    !myChar? null : available? {border: "3px solid green"} : null
                }>
                    {payload.username}
                    <p>{myChar}</p>
                </div>
            </div> }
        </div>
        
    </div>
}