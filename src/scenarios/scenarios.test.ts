import { describe, expect, test } from "vitest"
import { allMet, checkGoals } from "../core/goals.ts"
import { grade } from "../core/grade.ts"
import { buildDeck } from "../core/start.ts"
import { scenarios } from "./index.ts"
import { solutions } from "./solutions.ts"

describe("scenarios", () => {
  test("ids are unique and every scenario has a reference solution", () => {
    const ids = scenarios.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const id of ids) expect(solutions[id], id).toBeTypeOf("function")
  })

  for (const scenario of scenarios) {
    test(`${scenario.id}: the start is not solved, the reference solution is`, () => {
      // Arrange
      const start = buildDeck(scenario.start)
      const solve = solutions[scenario.id]
      if (!solve) throw new Error("no solution")

      // Act
      const before = checkGoals(start, scenario.goals)
      const after = grade(scenario, JSON.parse(JSON.stringify(solve(start))))

      // Assert
      expect(allMet(before)).toBe(false)
      expect(after.status).toBe("checked")
      if (after.status === "checked") expect(after.results.filter((r) => !r.ok).map((r) => r.text)).toEqual([])
    })
  }
})
