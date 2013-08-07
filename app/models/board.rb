class Board
  include Mongoid::Document
  field :name
  field :content

  embeds_many :widgets
end
