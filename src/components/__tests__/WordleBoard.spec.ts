import { beforeEach, describe, expect, test, vi } from 'vitest'

import { mount } from '@vue/test-utils'
import WordleBoard from '../WordleBoard.vue'
import GuessView from "../GuessView.vue"

import { MAX_GUESSES, VICTORY_MESSAGE, DEFEAT_MESSAGE, WORD_SIZE } from '@/settings'

describe('WordleBoard', () => {
  const wordOfTheDay = 'TESTS'
  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    wrapper = mount(WordleBoard, { props: { wordOfTheDay } })
  })

  async function playerTypesGuess (guess: string) {
    await wrapper.find('input[type=text]').setValue(guess)
  }

  async function playerPressesEnter () {
    await wrapper.find('input[type=text]').trigger('keydown.enter')
  }

  async function playerTypesAndSubmitsGuess (guess: string) {
    await playerTypesGuess(guess)
    await playerPressesEnter()
  }

  describe('End of the game messages', () => {
    test('A Victory message appears when the user makes a guess that matches the word of the day', async () => {
      await playerTypesAndSubmitsGuess(wordOfTheDay)

      expect(wrapper.text()).toContain(VICTORY_MESSAGE)
    })


    describe.each([
      { numberOfGuesses: 0, shouldSeeDefeatMessage: false },
      { numberOfGuesses: 1, shouldSeeDefeatMessage: false },
      { numberOfGuesses: 2, shouldSeeDefeatMessage: false },
      { numberOfGuesses: 3, shouldSeeDefeatMessage: false },
      { numberOfGuesses: 4, shouldSeeDefeatMessage: false },
      { numberOfGuesses: 5, shouldSeeDefeatMessage: false },
      { numberOfGuesses: MAX_GUESSES, shouldSeeDefeatMessage: true },
    ])(`A defeat message should appear if the player makes ${MAX_GUESSES} incorrect guesses`, ({
      numberOfGuesses,
      shouldSeeDefeatMessage
    }) => {
      test(`Therefore for ${numberOfGuesses} guess(es), a defeat message should ${shouldSeeDefeatMessage ? '' : 'not'} appear`, async () => {
        for (let i = 0; i < numberOfGuesses; i++) {
          await playerTypesAndSubmitsGuess('WRONG')
        }

        if (shouldSeeDefeatMessage) {
          expect(wrapper.text()).toContain(DEFEAT_MESSAGE)
        } else {
          expect(wrapper.text()).not.toContain(DEFEAT_MESSAGE)

        }
      })
    })

    test('no end of game message appears if the user has not yet made a guess', async () => {
      expect(wrapper.text()).not.toContain(VICTORY_MESSAGE)
      expect(wrapper.text()).not.toContain(DEFEAT_MESSAGE)
    })
  })

  describe('Rules for defining the word of the day', () => {
    beforeEach(() => {
      console.warn = vi.fn()
    })

    test.each([
      {wordOfTheDay: 'FLY', reason: 'word of the day must have 5 letters'},
      {wordOfTheDay: 'tests', reason: 'word of the day must be all in uppercase'},
      {wordOfTheDay: 'QWERT', reason: 'word of the day must be a valid english word'}
    ])('Since $reason: $wordOfTheDay is invalid, therefore a warning is emitted', async ({ wordOfTheDay }) => {
      mount(WordleBoard, { props: { wordOfTheDay } })

      expect(console.warn).toHaveBeenCalled()
    })

    test('No warning is emitted if the word of the day is a real upper case english word', async () => {
      mount(WordleBoard, { props: { wordOfTheDay: 'TESTS' } })

      expect(console.warn).not.toHaveBeenCalled()
    })
  })

  describe('Player Input', () => {
    test(`Player guesses are limited to ${WORD_SIZE} characters`, async () => {
      await playerTypesAndSubmitsGuess(wordOfTheDay + 'EXTRA')

      expect(wrapper.text()).toContain(VICTORY_MESSAGE)
    })

    test('the input gets cleared after each submission', async () => {
      await playerTypesAndSubmitsGuess('WRONG')

      expect(wrapper.find<HTMLInputElement>('input[type=text]').element.value).toEqual('')
    })

    test('Player Guesses can only be submitted if they are real words', async () => {
      await playerTypesAndSubmitsGuess('QWERT')

      expect(wrapper.text()).not.toContain(VICTORY_MESSAGE)
      expect(wrapper.text()).not.toContain(DEFEAT_MESSAGE)
    })

    test('Player guesses are not case sensitive', async () => {
      await playerTypesAndSubmitsGuess(wordOfTheDay.toLowerCase())

      expect(wrapper.text()).toContain(VICTORY_MESSAGE)
    })

    test('Player guesses can only contain letters', async () => {
      await playerTypesGuess('H3!RT')

      expect(wrapper.find<HTMLInputElement>('input[type=text]').element.value).toEqual('HRT')
    })

    test('The player loses control after the max amount of guesses', async () => {
      const guesses = [
        'WRONG',
        'GUESS',
        'HELLO',
        'WORLD',
        'HAPPY',
        'CODER'
      ]
      for (const guess of guesses) {
        await playerTypesAndSubmitsGuess(guess)
      }

      expect(wrapper.find('input[type=text]').attributes('disabled')).not.toBeUndefined()
    })

    test('The player loses control after the correct guess is given', async () => {
      await playerTypesAndSubmitsGuess(wordOfTheDay)

      expect(wrapper.find('input[type=text]').attributes('disabled')).not.toBeUndefined()
    })
  })

  test('All previous Guesses done by the player are visible on the page', async () => {
    const guesses = [
      'WRONG',
      'GUESS',
      'HELLO',
      'WORLD',
      'HAPPY',
      'CODER'
    ]

    for (const guess of guesses) {
      await playerTypesAndSubmitsGuess(guess)
    }

    for (const guess of guesses) {
      expect(wrapper.text()).toContain(guess)
    }
  })

  describe(`there should always be exactly ${MAX_GUESSES} guess-views in the board`, async () => {
    test(`${MAX_GUESSES} guess-views are present at the start of the game`, async () => {
      expect(wrapper.findAllComponents(GuessView)).toHaveLength(MAX_GUESSES)
    })

    test(`${MAX_GUESSES} guess-views are present when the player wins the game`, async () => {
      await playerTypesAndSubmitsGuess(wordOfTheDay)

      expect(wrapper.findAllComponents(GuessView)).toHaveLength(MAX_GUESSES)
    })

    test(`${MAX_GUESSES} guess-views are present as the player loses the game`, async () => {
      const guesses = [
        "WRONG",
        "GUESS",
        "HELLO",
        "WORLD",
        "HAPPY",
        "CODER"
      ]

      for (const guess of guesses) {
        await playerTypesAndSubmitsGuess(guess)
        expect(wrapper.findAllComponents(GuessView)).toHaveLength(MAX_GUESSES)
      }
    })
  })

  describe('Displaying hints/feedback to the player', () => {
    test('hints are not displayed until the player submits their guess', async () => {
      expect(wrapper.find('[data-letter-feedback]').exists()).toBe(false)

      await playerTypesGuess(wordOfTheDay)
      expect(wrapper.find('[data-letter-feedback]').exists()).toBe(false)

      await playerPressesEnter()
      expect(wrapper.find('[data-letter-feedback]').exists()).toBe(true)
    })
  })

  describe.each([
    {
      position: 0,
      expectedFeedback: 'correct',
      reason: 'W is the first letter of "WORLD" and "WRONG"'
    },
    {
      position: 1,
      expectedFeedback: "almost",
      reason: 'R exists in both words, but it is in position "2" of "WORLD"'
    },
    {
      position: 2,
      expectedFeedback: "almost",
      reason: 'O exists in both words, but it is in position "1" of "WORLD"'
    },
    {
      position: 3,
      expectedFeedback: "incorrect",
      reason: 'N does not exist in "WORLD"'
    },
    {
      position: 4,
      expectedFeedback: "incorrect",
      reason: 'G does not exist in "WORLD"'
    }
  ])('If the word of the day is "WORLD" and the player types "WRONG"', ({ position, expectedFeedback, reason }) => {
    const wordOfTheDay = 'WORLD'
    const playerGuess = 'WRONG'

    test(`the feedback for '${playerGuess[position]}' (index: ${position}) should be '${expectedFeedback}' because '${reason}'`, async () => {
      wrapper = mount(WordleBoard, { propsData: { wordOfTheDay } })

      await playerTypesAndSubmitsGuess(playerGuess)

      const actualFeedback = wrapper.findAll('[data-letter]').at(position)?.attributes('data-letter-feedback')

      expect(actualFeedback).toEqual(expectedFeedback)
    })
  })
})
