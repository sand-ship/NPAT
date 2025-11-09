/*
  # Create game tables

  1. New Tables
    - `games`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `status` (text) - 'waiting', 'playing', 'finished'
      - `current_player_id` (uuid)
      - `winner_id` (uuid)
      - `alphabet` (text[])
      
    - `game_players`
      - `id` (uuid, primary key)
      - `game_id` (uuid)
      - `user_id` (uuid)
      - `name` (text)
      - `color` (text)
      - `avatar` (integer)
      - `position` (integer)
      - `created_at` (timestamp)
      
    - `game_moves`
      - `id` (uuid, primary key)
      - `game_id` (uuid)
      - `player_id` (uuid)
      - `roll` (integer)
      - `category` (text)
      - `answer` (text)
      - `created_at` (timestamp)
      
    - `game_votes`
      - `id` (uuid, primary key)
      - `game_id` (uuid)
      - `move_id` (uuid)
      - `voter_id` (uuid)
      - `approved` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create games table
CREATE TABLE IF NOT EXISTS games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  status text NOT NULL DEFAULT 'waiting',
  current_player_id uuid,
  winner_id uuid,
  alphabet text[] NOT NULL,
  CONSTRAINT status_check CHECK (status IN ('waiting', 'playing', 'finished'))
);

-- Create game_players table
CREATE TABLE IF NOT EXISTS game_players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid REFERENCES games(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  color text NOT NULL,
  avatar integer NOT NULL,
  position integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create game_moves table
CREATE TABLE IF NOT EXISTS game_moves (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid REFERENCES games(id) ON DELETE CASCADE,
  player_id uuid REFERENCES game_players(id) ON DELETE CASCADE,
  roll integer NOT NULL,
  category text NOT NULL,
  answer text,
  created_at timestamptz DEFAULT now()
);

-- Create game_votes table
CREATE TABLE IF NOT EXISTS game_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid REFERENCES games(id) ON DELETE CASCADE,
  move_id uuid REFERENCES game_moves(id) ON DELETE CASCADE,
  voter_id uuid REFERENCES game_players(id) ON DELETE CASCADE,
  approved boolean NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(move_id, voter_id)
);

-- Enable RLS
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_moves ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_votes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view games"
  ON games FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create games"
  ON games FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Players can update their games"
  ON games FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM game_players
    WHERE game_players.game_id = games.id
    AND game_players.user_id = auth.uid()
  ));

CREATE POLICY "Anyone can view game players"
  ON game_players FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can join games"
  ON game_players FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Players can update their own data"
  ON game_players FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Anyone can view game moves"
  ON game_moves FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Players can create moves in their games"
  ON game_moves FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM game_players
    WHERE game_players.id = game_moves.player_id
    AND game_players.user_id = auth.uid()
  ));

CREATE POLICY "Anyone can view votes"
  ON game_votes FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Players can vote on moves"
  ON game_votes FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM game_players
    WHERE game_players.id = game_votes.voter_id
    AND game_players.user_id = auth.uid()
  ));