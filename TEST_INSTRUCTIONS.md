# Test Instructions for Candidates

## Welcome!

This is a fullstack development test designed to evaluate your skills in building real-time applications. You'll be working with:
- **Backend**: Python (FastAPI)
- **Frontend**: React + TypeScript with TanStack Router and TanStack Query
- **Real-time**: WebSocket and Server-Sent Events (SSE)

## Time Allocation

**Recommended Time**: 2-4 hours  
**Maximum Time**: 1 day

Focus on quality over quantity. We value clean, maintainable code.

## Your Task

The codebase is already functional but has room for improvement. Your task is to **enhance and extend** the real-time data visualization system.

### Required Improvements

1. **Optimize Real-time Hook Usage**
   - Currently, both WebSocket and SSE hooks run simultaneously
   - Implement conditional hook execution to only activate the selected connection method
   - This will improve performance and resource usage

2. **Add Visual Feedback for Changes**
   - When an asset updates, highlight the changed row
   - Show a brief animation or color change to indicate which fields changed
   - Highlight should fade after 2-3 seconds

3. **Improve Error Handling**
   - Add better error messages for connection failures
   - Implement exponential backoff for reconnection attempts
   - Show user-friendly error states in the UI

### Optional Enhancements (Bonus Points)

Choose any of these to demonstrate your skills:

1. **Add Filtering/Sorting**
   - Allow users to filter by asset type (glb/gltf)
   - Add sorting by name or last modified date
   - Preserve filters when switching connection methods

2. **Performance Optimization**
   - Implement efficient diffing to only update changed rows
   - Add virtual scrolling for large asset lists
   - Optimize re-renders using React.memo or useMemo

3. **Asset Detail View**
   - Click on an asset row to see detailed information
   - Create a new route using TanStack Router
   - Show real-time updates in the detail view as well

4. **Connection Quality Indicator**
   - Show connection latency/ping time
   - Display message count or update frequency
   - Add connection health metrics

5. **Backend Enhancements**
   - Add REST endpoints for creating/updating/deleting assets
   - Implement validation with Pydantic models
   - Add rate limiting or request logging

6. **Testing**
   - Write unit tests for hooks (useWebSocket, useServerSentEvents)
   - Add integration tests for the API endpoints
   - Test error scenarios and edge cases

## Evaluation Criteria

We'll evaluate you on:

1. **Code Quality** (30%)
   - Clean, readable code
   - Proper TypeScript usage
   - Following best practices

2. **Problem Solving** (25%)
   - Efficient solutions
   - Performance considerations
   - Edge case handling

3. **Architecture** (20%)
   - Component structure
   - Separation of concerns
   - Reusability

4. **Real-time Implementation** (15%)
   - Understanding of SSE vs WebSocket
   - Connection management
   - Error recovery

5. **Testing & Documentation** (10%)
   - Code comments where needed
   - Tests for critical paths
   - Clear commit messages (if using Git)

## Getting Started

1. **Read the README.md** - Understand the project structure
2. **Run the application** - Make sure everything works
3. **Explore the codebase** - Understand the current implementation
4. **Plan your improvements** - Think before coding
5. **Implement** - Focus on the required improvements first

## Submitting Your Work

1. **Code Changes**: Make your improvements in the codebase
2. **Documentation**: Update the README or create a separate file explaining:
   - What you implemented
   - Why you made certain decisions
   - Any assumptions or limitations
3. **Optional**: Include a brief summary of what you would do if you had more time

## Questions?

Feel free to ask questions if something is unclear. Good developers ask questions when needed!

## Tips

- Start with the required improvements
- Don't over-engineer - simple solutions are often best
- Test your changes thoroughly
- Consider edge cases (slow connections, server restarts, etc.)
- Write clean, self-documenting code
- Use TypeScript features appropriately
- Leverage TanStack Query features for caching and state management

## Good Luck! 🚀

Remember, we're looking for thoughtful, clean solutions. Quality over quantity!
