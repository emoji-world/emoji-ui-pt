import style from './index.module.scss';

export default
function NavMenu() {
  return <nav className={style.com}>
    <ol>
      <li>
        <a href="/">Game</a>
      </li>
      <li>
        <a href="/swap">Swap</a>
      </li>
      <li>
        <a href="/finance">Finance</a>
      </li>
      <li>
        <a href="/news">News</a>
      </li>
    </ol>
  </nav>
}
