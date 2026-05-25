import useTicTacToe from "../hooks/components/useTicTacToe";

export default function TicTacToe() {
    const {users, connection, available, myChar, payload, joined, board, win, handleClick, getConnection, mePlay, otherPlay, otherUser, otherUserChar} = useTicTacToe();

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
                <div className="user other_user" style={otherPlay ? {border: "3px solid #26de81"} : null}>
                    {otherUser}
                    <p className={`status ${joined}`}>{joined}</p>
                    <p>{otherUserChar}</p>
                </div>

                <div className="board">
                    {board.map((item, i) => <div className="cell" onClick={() => handleClick(i)}>
                        {item}
                    </div> )}
                </div>
                
                <div className="user me" style={mePlay? {border: "3px solid #26de81"} : null}>
                    {payload.username}
                    <p>{myChar}</p>
                </div>
            </div> }
        </div>
        
    </div>
}