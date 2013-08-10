class Board
  include Mongoid::Document
  field :title
  field :content

  embeds_many :widgets
end
