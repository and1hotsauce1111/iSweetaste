export default function({ store, redirect }) {
  if (!store.state.user.user.name) {
    return redirect('/login')
  }
}
